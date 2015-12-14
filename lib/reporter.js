import events from 'events'
import Allure from 'allure-js-commons'
import Runtime from 'allure-js-commons/runtime'

/**
 * Initialize a new `Allure` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
class AllureReporter extends events.EventEmitter {
    constructor (baseReporter, config) {
        super()

        this.baseReporter = baseReporter
        this.config = config
        this.options = config.reporterOptions || {}
        this.outputDir = this.options.outputDir || 'allure-results'
        this.allure = new Allure()
        this.runtime = new Runtime(this.allure)

        this.allure.setOptions({
            targetDir: this.outputDir
        })

        const { epilogue } = this.baseReporter

        this.on('end', () => {
            this.parseStats()
            epilogue.call(baseReporter)
        })
    }

    parseStats () {
        for (let cid of Object.keys(this.baseReporter.stats.runners)) {
            const runner = this.baseReporter.stats.runners[cid]

            for (let specId of Object.keys(runner.specs)) {
                const spec = runner.specs[specId]

                for (let suiteName of Object.keys(spec.suites)) {
                    const suite = spec.suites[suiteName]
                    this.allure.startSuite(suiteName, suite.start.getTime())

                    for (let testName of Object.keys(suite.tests)) {
                        const test = suite.tests[testName]

                        if (test.state === 'pending') {
                            this.allure.pendingCase(testName, test.start.getTime())
                            continue
                        }

                        this.allure.startCase(testName, test.start.getTime())

                        this.runtime.addEnvironment('capabilities', runner.sanitizedCapabilities)
                        this.runtime.addEnvironment('baseUrl', runner.config.baseUrl)
                        this.runtime.addEnvironment('spec files', spec.files)

                        this.commandOutput = ''
                        this.openSteps = 0
                        test.output.map(output => {
                            switch (output.type) {
                            case 'beforecommand':
                                this.startStep(
                                    `${output.payload.command} ${JSON.stringify(output.payload.args)}`,
                                    output.payload.time.getTime()
                                )
                                break
                            case 'aftercommand':
                                this.flushCommandOutput(output.payload.time.getTime())
                                this.endStep('passed', output.payload.time.getTime())
                                break
                            case 'command':
                                this.commandOutput += `${this.formatTime(output.payload.time)} COMMAND: ${output.payload.method.toUpperCase()} ${output.payload.uri.href} - ${this.format(output.payload.data)}\n\n`
                                break
                            case 'result':
                                this.commandOutput += `${this.formatTime(output.payload.time)} RESULT: ${this.format(output.payload.body.value)}\n\n`
                                break
                            case 'screenshot':
                                this.reconcileSteps()
                                this.flushCommandOutput(output.payload.time.getTime())
                                this.startStep('screenshot', output.payload.time.getTime())
                                this.allure.addAttachment(
                                    `${output.payload.title} @ ${output.payload.parent}`,
                                    new Buffer(output.payload.data, 'base64')
                                )
                                this.endStep('screenshot', output.payload.time.getTime())
                                break
                            }
                        })
                        this.reconcileSteps()
                        this.flushCommandOutput()

                        if (test.state === 'pass') {
                            this.allure.endCase('passed')
                        } else if (test.error && test.error.type === 'AssertionError') {
                            this.allure.endCase('failed', test.error)
                        } else {
                            this.allure.endCase('broken', test.error)
                        }
                    }
                    this.allure.endSuite(spec.suites[suiteName].end && spec.suites[suiteName].end.getTime())
                    console.log(`Wrote Allure report for ${suiteName} to [${this.outputDir}].`)
                }
            }
        }
    }

    padTime (num, size = 2) {
        if (num >= Math.pow(10, size - 1)) return num
        return (Math.pow(10, size) + num).toString().substring(1)
    }

    formatTime (time) {
        return `${this.padTime(time.getHours())}:${this.padTime(time.getMinutes())}:${this.padTime(time.getSeconds())}.${this.padTime(time.getMilliseconds(), 3)}`
    }

    flushCommandOutput (timestamp) {
        if (!this.commandOutput) return
        this.allure.addAttachment(
            `Selenium log`,
            new Buffer(this.commandOutput)
        )
        this.commandOutput = ''
    }

    startStep (stepName, timestamp) {
        this.allure.startStep(stepName, timestamp)
        this.openSteps++
    }

    endStep (status, timestamp) {
        this.allure.endStep(status, timestamp)
        this.openSteps--
    }

    getCurrentStep () {
        return this.allure.getCurrentSuite().currentStep
    }

    reconcileSteps () {
        while (this.openSteps > 0) {
            console.log(`Mismatch between Allure startStep() and endStep(). Step ${this.getCurrentStep().name} was left unclosed.`)
            this.allure.endStep('broken')
            this.openSteps--
        }
    }

    format (val) {
        return JSON.stringify(this.baseReporter.limit(val))
    }
}

export default AllureReporter
