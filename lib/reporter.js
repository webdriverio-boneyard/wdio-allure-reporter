import events from 'events'
import Allure from 'allure-js-commons'

function isEmpty (object) {
    return !object || Object.keys(object).length === 0
}

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

        this.allure = new Allure()

        this.allure.setOptions({
            targetDir: this.options.outputDir || 'allure-results'
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

        this.on('runner:command', (command) => {
            const stepName = `${command.method} ${command.uri.path}`

            if (!this.allure.getCurrentTest()) {
                console.warn(stepName, 'is not whithin any running test')
                return
            }
            this.allure.startStep(`${command.method} ${command.uri.path}`)
            if (!isEmpty(command.data)) {
                this.dumpJSON('Request', command.data)
            }
        })

        this.on('runner:result', (command) => {
            if (!this.allure.getCurrentTest()) {
                return
            }
            if (command.requestOptions.uri.path.match(/\/wd\/hub\/session\/[^/]*\/screenshot/)) {
                this.allure.addAttachment('Screenshot', new Buffer(command.body.value, 'base64'))
            } else {
                this.dumpJSON('Response', command.body)
            }
            this.allure.endStep('passed')
        })
    }

    dumpJSON (name, json) {
        this.allure.addAttachment(name, JSON.stringify(json, null, '    '), 'application/json')
    }

    getProjectName () {
        return this.options.projectName || 'Unknown Project'
    }

}

export default AllureReporter
