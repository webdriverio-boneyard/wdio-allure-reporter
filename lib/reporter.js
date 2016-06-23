import events from 'events'
import Allure from 'allure-js-commons'
import Step from 'allure-js-commons/beans/step'

function isEmpty (object) {
    return !object || Object.keys(object).length === 0
}

const LOGGING_HOOKS = ['"before all" hook', '"after all" hook']

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
        this.allures = {}

        const { epilogue } = this.baseReporter

        this.on('end', () => {
            epilogue.call(baseReporter)
        })

        this.on('suite:start', (suite) => {
            const allure = this.getAllure(suite.specs, suite.cid)
            const currentSuite = allure.getCurrentSuite()
            const prefix = currentSuite ? currentSuite.name + ' ' : ''
            allure.startSuite(prefix + suite.title)
        })

        this.on('suite:end', (suite) => {
            this.getAllure(suite.specs, suite.cid).endSuite()
        })

        this.on('test:start', (test) => {
            const allure = this.getAllure(test.specs, test.cid)
            allure.startCase(test.title)

            const currentTest = allure.getCurrentTest()
            currentTest.addParameter('environment-variable', 'capabilities', JSON.stringify(test.runner[test.cid]))
            currentTest.addParameter('environment-variable', 'spec files', JSON.stringify(test.specs))
        })

        this.on('test:pass', (test) => {
            this.getAllure(test.specs, test.cid).endCase('passed')
        })

        this.on('test:fail', (test) => {
            const allure = this.getAllure(test.specs, test.cid)
            if (!allure.getCurrentTest()) {
                allure.startCase(test.title)
            } else {
                allure.getCurrentTest().name = test.title
            }
            const status = test.err.type === 'AssertionError' ? 'failed' : 'broken'
            while (allure.getCurrentSuite().currentStep instanceof Step) {
                allure.endStep(status)
            }
            allure.endCase(status, test.err)
        })

        this.on('runner:command', (command) => {
            const allure = this.getAllure(command.specs, command.cid)
            const stepName = `${command.method} ${command.uri.path}`

            if (!this.isAnyTestRunning(allure)) {
                console.warn(stepName, 'is not whithin any running test')
                return
            }
            allure.startStep(`${command.method} ${command.uri.path}`)
            if (!isEmpty(command.data)) {
                this.dumpJSON(allure, 'Request', command.data)
            }
        })

        this.on('runner:result', (command) => {
            const allure = this.getAllure(command.specs, command.cid)
            if (!this.isAnyTestRunning(allure)) {
                return
            }
            if (command.requestOptions.uri.path.match(/\/wd\/hub\/session\/[^/]*\/screenshot/)) {
                allure.addAttachment('Screenshot', new Buffer(command.body.value, 'base64'))
            } else {
                this.dumpJSON(allure, 'Response', command.body)
            }
            allure.endStep('passed')
        })

        this.on('hook:start', (hook) => {
            const allure = this.getAllure(hook.specs, hook.cid)
            if (!allure.getCurrentSuite() || LOGGING_HOOKS.indexOf(hook.title) === -1) {
                return
            }
            allure.startCase(hook.title)
        })

        this.on('hook:end', (hook) => {
            const allure = this.getAllure(hook.specs, hook.cid)
            if (!allure.getCurrentSuite() || LOGGING_HOOKS.indexOf(hook.title) === -1) {
                return
            }
            allure.endCase('passed')
            if (allure.getCurrentTest().steps.length === 0) {
                allure.getCurrentSuite().testcases.pop()
            }
        })
    }

    getAllure (specs, cid) {
        const key = JSON.stringify({specs: specs, cid: cid})
        if (!this.allures[key]) {
            const allure = new Allure()
            allure.setOptions({
                targetDir: this.options.outputDir || 'allure-results'
            })
            this.allures[key] = allure
        }
        return this.allures[key]
    }

    isAnyTestRunning (allure) {
        return allure.getCurrentSuite() && allure.getCurrentTest()
    }

    dumpJSON (allure, name, json) {
        allure.addAttachment(name, JSON.stringify(json, null, '    '), 'application/json')
    }

}

export default AllureReporter
