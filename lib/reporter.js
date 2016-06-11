import events from 'events'
import Allure from 'allure-js-commons'

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
        this.options = options.allure || {}
        this.outputDir = this.options.outputDir || 'allure-results'
        this.level = 0
        this.currentHooks = []
        this.parents = []

        this.allure = new Allure()

        this.allure.setOptions({
            targetDir: this.outputDir
        })

        const { epilogue } = this.baseReporter

        // this suite catches errors in hooks of the root suite
        this.allure.startSuite(this.getProjectName())

        this.on('end', () => {
            this.allure.endSuite(this.getProjectName())
            epilogue.call(baseReporter)
        })

        this.on('suite:start', (suite) => {
            const prefix = this.allure.suites.length > 1
                ? this.allure.getCurrentSuite().name + ' '
                : ''
            this.allure.startSuite(prefix + suite.title)
        })

        this.on('suite:end', (suite) => {
            this.allure.endSuite()
        })

        this.on('test:start', (test) => {
            this.allure.startCase(test.title)
        })

        this.on('test:pass', (test) => {
            this.allure.endCase('passed')
        })

        this.on('test:fail', (test) => {
            if (!this.allure.getCurrentTest()) {
                this.allure.startCase(test.title)
            } else {
                this.allure.getCurrentTest().name = test.title
            }
            const status = test.err.type === 'AssertionError' ? 'failed' : 'broken'
            this.allure.endCase(status, test.err)
        })

        this.on('runner:screenshot', (screenshot) => {
            throw new Error('test')
            // this.instances.screenshot(screenshot)
        })
    }

    getProjectName () {
        return this.options.projectName || 'Unknown Project'
    }

}

export default AllureReporter
