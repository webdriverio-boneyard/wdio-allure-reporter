import events from 'events'
import Allure from 'allure-js-commons'

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
            const capabilities = this.baseReporter.stats.runners[cid]

            for (let specId of Object.keys(capabilities.specs)) {
                const spec = capabilities.specs[specId]

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

                        // NB: 'parameters' are appropriate here, but not yet implemented: https://github.com/allure-framework/allure-js-commons/issues/8
                        // this.allure.getCurrentSuite().currentTest.addLabel('specId', specId)
                        // this.allure.getCurrentSuite().currentTest.addLabel('capabilities', capabilities.sanitizedCapabilities)

                        let openSteps = 0
                        test.output.map(output => {
                            switch (output.type) {
                            case 'beforecommand':
                                openSteps++
                                this.allure.startStep(
                                    `${output.payload.command} ${JSON.stringify(output.payload.args)}`,
                                    output.payload.time.getTime()
                                )
                                break
                            case 'aftercommand':
                                openSteps--
                                this.allure.endStep('passed', output.payload.time.getTime())
                                break
                            case 'screenshot':
                                this.allure.startStep('screenshot', output.payload.time.getTime())
                                this.allure.addAttachment(
                                    `${output.payload.title} @ ${output.payload.parent}`,
                                    new Buffer(output.payload.data, 'base64')
                                )
                                this.allure.endStep('screenshot', output.payload.time.getTime())
                                break
                            }
                        })
                        if (openSteps !== 0) {
                            console.log(`Mismatch between Allure startStep() and endStep() count: Remaining open steps: ${openSteps}`)
                            while (openSteps > 0) {
                                this.allure.endStep('broken', Date.now())
                                openSteps--
                            }
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
                    console.log(`Writing Allure report for ${suiteName} to [${this.outputDir}].`)
                }
            }
        }
    }
}

export default AllureReporter
