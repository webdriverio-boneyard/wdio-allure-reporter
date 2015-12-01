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
        this.allure = new Allure()

        const { epilogue } = this.baseReporter

        this.on('end', () => {
            this.parseStats(capabilities)
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

                        if (test.state === 'pass') {
                            this.allure.endCase('passed')
                        } else {
                            // TODO: determine if test was broken: status='broken'
                            this.allure.endCase('failed', test.error)
                        }

                        this.allure.getCurrentSuite().currentTest.addLabel('specId', specId)
                        this.allure.getCurrentSuite().currentTest.addLabel('capabilities', capabilities.sanitizedCapabilities)
                    }
                    this.allure.endSuite(spec.suites[suiteName].end.getTime())
                }
            }
        }
    }
}

export default AllureReporter
