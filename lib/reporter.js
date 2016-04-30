import events from 'events'
import Allure from 'allure-js-commons'
import Runtime from 'allure-js-commons/runtime'
import Instances from './instances'

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
        this.level = 0;
        this.currentHooks = [];
        this.parents = [];

        this.allure = new Allure()
        this.runtime = new Runtime(this.allure)

        this.allure.setOptions({
            targetDir: this.outputDir
        })

        this.instances = new Instances({
            allure: this.allure,
            runtime: this.runtime,
            verbose: this.options.verbose
        });

        const { epilogue } = this.baseReporter

        // this suite catches errors in hooks of the root suite
        this.allure.startSuite(this.getProjectName())

        this.on('end', () => {

            Object.keys(this.instances.instances).forEach((identifier) => {
                this.instances.instances[identifier].endInstance()
            })
            this.allure.endSuite(this.getProjectName())
            epilogue.call(baseReporter)

        })

        this.on('suite:start', (suite) => {
            this.instances.startSuite(suite);
        })

        this.on('test:start', (test) => {
            this.instances.startTest(test)
        })

        this.on('test:end', (test) => {
            this.instances.endTest(test);
        });

        this.on('test:pass', (test) => {
            this.instances.passTest(test)
        })

        this.on('test:fail', (test) => {
            this.instances.failTest(test)
        })

        // track chains of hooks to later determine whether a test or a hook failed
        this.on('hook:start', (hook) => {
            this.instances.startHook(hook)
        })

        this.on('hook:end', (hook) => {
            this.instances.endHook(hook)
        })

        this.on('runner:screenshot', (screenshot) => {
            this.instances.screenshot(screenshot)
        })
    }
    
    getProjectName () {
        return this.options.projectName || 'Unknown Project';
    }

}

export default AllureReporter
