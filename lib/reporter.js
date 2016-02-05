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
    constructor (baseReporter, config, options = {}) {
        super()

        this.baseReporter = baseReporter
        this.config = config
        this.options = options
        this.outputDir = this.options.outputDir || 'allure-results'
        this.allure = new Allure()
        this.runtime = new Runtime(this.allure)

        this.allure.setOptions({
            targetDir: this.outputDir
        })

        const { epilogue } = this.baseReporter

        this.on('end', () => {
            try {
                this.parseStats(this.baseReporter.stats)
            } catch (e) {
                const logFile = require('path').join(process.cwd(), 'allure-reporter-debug.log')
                require('fs').writeFileSync(logFile, JSON.stringify(this.baseReporter.stats))

                console.error(`Failed parsing stats for Allure reporter: ${e.message}. Dumped this.baseReporter.stats to ${logFile}.`)
                console.error(e.stack)
            }

            epilogue.call(baseReporter)
        })
    }

    parseStats (stats) {
        this.commandOutput = []
        for (let cid of Object.keys(stats.runners)) {
            const runner = stats.runners[cid]

            for (let specId of Object.keys(runner.specs)) {
                const spec = runner.specs[specId]
                this.sessionID = runner.sessionID

                // Save any pre-test commands and output
                this.preTestOutput = spec.output

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
                        this.openSteps = 0

                        this.runtime.addEnvironment('capabilities', runner.sanitizedCapabilities)
                        this.runtime.addEnvironment('baseUrl', runner.config.baseUrl)
                        this.runtime.addEnvironment('spec files', spec.files)

                        if (this.preTestOutput && this.preTestOutput.length) {
                            this.startStep('before first test', this.preTestOutput[0].payload.time.getTime())
                            this.addOutput(this.preTestOutput)
                            this.flushCommandOutput()
                            const endTime = this.preTestOutput[(this.preTestOutput.length - 1)].payload.time.getTime()
                            this.endStep('passed', endTime)
                            this.reconcileSteps(endTime)
                            delete this.preTestOutput
                        }

                        this.addOutput(test.output)
                        this.reconcileSteps()

                        if (this.commandOutput.length) {
                            this.startStep('after last command')
                            this.flushCommandOutput()
                            this.endStep('passed')
                        }

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

    stripSessionId (path) {
        return path.replace(new RegExp('^.*?' + this.sessionID), '')
    }

    addOutput (events) {
        this.commandOutput = []
        events.map((event, index) => {
            switch (event.type) {
            case 'beforecommand':
                this.startStep(
                    `${event.payload.command} ${JSON.stringify(event.payload.args)}`,
                    event.payload.time.getTime()
                )
                break
            case 'aftercommand':
                this.flushCommandOutput()
                this.endStep('passed', event.payload.time.getTime())
                break
            case 'command':
                this.commandOutput.push(`${this.formatTime(event.payload.time)} COMMAND: ${event.payload.method.toUpperCase()} ${this.stripSessionId(event.payload.uri.path)} - ${this.format(event.payload.data)}\n\n`)
                break
            case 'result':
                this.commandOutput.push(`${this.formatTime(event.payload.time)} RESULT: ${this.format(event.payload.body.value)}\n\n`)
                break
            case 'screenshot':
                const penultimateEvent = events[index - 2]
                let screenshotCommands = []
                let screenshotStart = event.payload.time.getTime()
                let screenshotEnd = screenshotStart

                if (penultimateEvent && penultimateEvent.type === 'command' && penultimateEvent.payload.uri.path.match(/screenshot/i)) {
                    screenshotStart = penultimateEvent.payload.time.getTime()
                    screenshotCommands.unshift(this.commandOutput.pop())
                    screenshotCommands.unshift(this.commandOutput.pop())
                }
                this.flushCommandOutput()

                this.startStep('screenshot', screenshotStart)
                this.allure.addAttachment(
                    event.payload.filename || `${event.payload.title} @ ${event.payload.parent}`,
                    new Buffer(event.payload.data, 'base64')
                )

                if (screenshotCommands.length) {
                    this.commandOutput.push(screenshotCommands.shift())
                    this.commandOutput.push(screenshotCommands.shift())
                    this.flushCommandOutput()
                }

                this.endStep('passed', screenshotEnd)
                break
            case 'log':
                this.commandOutput.push(`${this.formatTime(event.payload.time)} LOG: ${this.format(event.payload.data)}\n\n`)
                break
            }
        })
    }

    flushCommandOutput (name = 'Selenium log') {
        if (!this.commandOutput.length) return
        this.allure.addAttachment(
            name,
            new Buffer(this.commandOutput.join(''))
        )
        this.commandOutput = []
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

    reconcileSteps (timestamp) {
        while (this.openSteps > 0) {
            this.endStep('broken', timestamp)
        }
    }

    format (val) {
        return JSON.stringify(this.baseReporter.limit(val))
    }
}

export default AllureReporter
