import process from 'process'
import events from 'events'
import Allure from 'allure-js-commons'
import Step from 'allure-js-commons/beans/step'
import {getTestStatus, isEmpty, PASSED, BROKEN, FAILED} from './utils'

const LOGGING_HOOKS = ['"before all" hook', '"after all" hook']
const STEP_STATUSES = [FAILED, PASSED, BROKEN]

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
        this.isMultiremote = false
        this.options = options
        this.allures = {}

        const { epilogue } = this.baseReporter

        if (this.options.useCucumberStepReporter) {
            // Hook events
            this.on('hook:start', ::this.cucumberHookStart)
            this.on('hook:end', ::this.cucumberHookEnd)
            // Test framework events
            this.on('suite:start', ::this.cucumberSuiteStart)
            this.on('suite:end', ::this.cucumberSuiteEnd)
            this.on('test:start', ::this.cucumberTestStart)
            this.on('test:pass', ::this.cucumberTestPass)
            this.on('test:fail', ::this.cucumberTestFail)
            this.on('test:pending', ::this.cucumberTestPending)
        } else {
            // Hook events
            this.on('hook:start', ::this.hookStart)
            this.on('hook:end', ::this.hookEnd)
            // Test framework events
            this.on('suite:start', ::this.suiteStart)
            this.on('suite:end', ::this.suiteEnd)
            this.on('test:start', ::this.testStart)
            this.on('test:pass', ::this.testPass)
            this.on('test:fail', ::this.testFail)
            this.on('test:pending', ::this.testPending)
        }

        // Runner events (webdriver)
        this.on('start', ::this.start)
        this.on('runner:command', ::this.runnerCommand)
        this.on('runner:step', ::this.step)
        this.on('runner:result', ::this.runnerResult)
        this.on('end', () => {
            epilogue.call(baseReporter)
        })

        // Allure events
        this.on('allure:feature', ::this.allureFeature)
        this.on('allure:addEnvironment', ::this.allureAddEnvironment)
        this.on('allure:addDescription', ::this.allureAddDescription)
        this.on('allure:attachment', ::this.allureAttachment)
        this.on('allure:story', ::this.allureStory)
        this.on('allure:severity', ::this.allureSeverity)
        this.on('allure:issue', ::this.allureIssue)
        this.on('allure:testId', ::this.allureTestId)
        this.on('allure:addArgument', ::this.allureAddArgument)
    }

    suiteStart (suite) {
        const allure = this.getAllure(suite.cid)
        const currentSuite = allure.getCurrentSuite()
        const prefix = currentSuite ? currentSuite.name + ' ' : ''
        allure.startSuite(prefix + suite.title)
    }

    suiteEnd (suite) {
        this.getAllure(suite.cid).endSuite()
    }

    testStart (test) {
        const allure = this.getAllure(test.cid)
        allure.startCase(test.title)
        const currentTest = allure.getCurrentTest()

        this.addBrowserOrDeviceParameter({ cid: test.cid, runner: test.runner })
        currentTest.addParameter('environment-variable', 'capabilities', JSON.stringify(test.runner[test.cid]))
        currentTest.addParameter('environment-variable', 'spec files', JSON.stringify(test.specs))

        if (test.featureName && test.scenarioName) {
            currentTest.addLabel('feature', test.featureName)
            currentTest.addLabel('story', test.scenarioName)
        }

        // Analytics labels More: https://github.com/allure-framework/allure2/blob/master/Analytics.md
        currentTest.addLabel('language', 'javascript')
        currentTest.addLabel('framework', 'wdio')
        currentTest.addLabel('thread', test.cid)
    }

    testPass (test) {
        this.getAllure(test.cid).endCase(PASSED)
    }

    testFail (test) {
        const allure = this.getAllure(test.cid)

        if (!allure.getCurrentTest()) {
            allure.startCase(test.title)
        } else {
            allure.getCurrentTest().name = test.title
        }

        const status = getTestStatus(test, this.config)
        while (allure.getCurrentSuite().currentStep instanceof Step) {
            allure.endStep(status)
        }

        allure.endCase(status, test.err)
    }

    testPending (test) {
        const allure = this.getAllure(test.cid)
        if (allure.getCurrentTest() && allure.getCurrentTest().status !== 'pending') {
            allure.endCase('pending')
        } else {
            allure.pendingCase(test.title)
        }
    }

    runnerCommand (command) {
        if (this.options.disableWebdriverStepsReporting || this.isMultiremote) {
            return
        }

        const allure = this.getAllure(command.cid)

        if (!this.isAnyTestRunning(allure)) {
            return
        }

        allure.startStep(`${command.method} ${command.uri.path}`)

        if (!isEmpty(command.data)) {
            this.dumpJSON(allure, 'Request', command.data)
        }
    }

    step ({event, cid, step}) {
        const allure = this.getAllure(cid)

        if (!this.isAnyTestRunning(allure)) {
            return
        }

        allure.startStep(step.title)

        if (!isEmpty(step.body)) {
            allure.addAttachment(step.bodyLabel, step.body)
        }

        if (STEP_STATUSES.indexOf(step.status) === -1) {
            throw new Error(`Step status must be ${STEP_STATUSES.join(' or ')}. You tried to set "${step.status}"`)
        }

        allure.endStep(step.status)
    }

    start (event) {
        this.isMultiremote = event.isMultiremote
    }

    runnerResult (command) {
        if (this.isMultiremote) {
            return
        }

        const allure = this.getAllure(command.cid)

        if (!this.isAnyTestRunning(allure)) {
            return
        }

        if (command.requestOptions.uri.path.match(/\/session\/[^/]*\/screenshot/) && command.body.value) {
            if (!this.options.disableWebdriverScreenshotsReporting) {
                allure.addAttachment('Screenshot', Buffer.from(command.body.value, 'base64'))
            }
        } else if (!this.options.disableWebdriverStepsReporting) {
            if (command.body) {
                this.dumpJSON(allure, 'Response', command.body)
            }

            allure.endStep(PASSED)
        }
    }

    hookStart (hook) {
        const allure = this.getAllure(hook.cid)

        if (!allure.getCurrentSuite() || LOGGING_HOOKS.indexOf(hook.title) === -1) {
            return
        }

        allure.startCase(hook.title)
    }

    hookEnd (hook) {
        const allure = this.getAllure(hook.cid)

        if (!allure.getCurrentSuite() || LOGGING_HOOKS.indexOf(hook.title) === -1) {
            return
        }

        allure.endCase(PASSED)

        if (allure.getCurrentTest().steps.length === 0) {
            allure.getCurrentSuite().testcases.pop()
        }
    }

    cucumberHookStart (hook) {
        const allure = this.getAllure(hook.cid)

        if (hook.title) {
            allure.startStep(hook.title)
        }
    }

    cucumberHookEnd (hook) {
        const allure = this.getAllure(hook.cid)

        if (hook.title) {
            allure.endStep(hook.title)
        }
        allure.endCase(PASSED)
    }

    cucumberSuiteStart (suite) {
        const allure = this.getAllure(suite.cid)

        if (!suite.parent) {
            const currentSuite = allure.getCurrentSuite()
            const prefix = currentSuite ? `${currentSuite.name} ` : ''
            allure.startSuite(prefix + suite.title)
        } else {
            if (suite.title) {
                allure.startCase(suite.title)
                const currentSuite = allure.getCurrentSuite()
                const test = allure.getCurrentTest()

                this.addBrowserOrDeviceParameter({ cid: suite.cid, runner: suite.runner })
                test.addLabel('feature', currentSuite.name)

                // Analytics labels More: https://github.com/allure-framework/allure2/blob/master/Analytics.md
                test.addLabel('language', 'javascript')
                test.addLabel('framework', 'wdio')
                test.addLabel('thread', suite.cid)
            }
        }
    }

    cucumberSuiteEnd (suite) {
        if (!suite.parent) {
            this.getAllure(suite.cid).endSuite()
        } else {
            if (suite.title) {
                this.getAllure(suite.cid).endCase(PASSED)
            }
        }
    }

    cucumberTestStart (test) {
        const allure = this.getAllure(test.cid)

        if (!this.isAnyTestRunning(allure)) {
            return
        }

        if (test.title) {
            allure.startStep(test.title)
        }
    }

    cucumberTestPass (test) {
        const allure = this.getAllure(test.cid)
        while (allure.getCurrentSuite().currentStep instanceof Step) {
            allure.endStep(PASSED)
        }
    }

    cucumberTestFail (test) {
        if (test.title) {
            const allure = this.getAllure(test.cid)
            if (!this.isAnyTestRunning(allure)) {
                return
            }

            const status = getTestStatus(test, this.config)

            while (allure.getCurrentSuite().currentStep instanceof Step) {
                allure.endStep(status)
            }

            allure.endCase(status, test.err)
        }
    }

    cucumberTestPending (test) {
        const allure = this.getAllure(test.cid)

        if (test.title) {
            allure.endStep('pending')
        }

        if (allure.getCurrentSuite() && allure.getCurrentSuite().status !== 'pending') {
            allure.endCase('pending')
        } else {
            allure.pendingCase(test.title)
        }
    }

    allureFeature ({ cid, featureName }) {
        const allure = this.getAllure(cid)
        const test = allure.getCurrentTest()
        test.addLabel('feature', featureName)
    }

    allureAddEnvironment ({ cid, name, value }) {
        const allure = this.getAllure(cid)
        const test = allure.getCurrentTest()
        test.addParameter('environment-variable', name, value)
    }

    allureAddDescription ({ cid, description, type }) {
        const allure = this.getAllure(cid)
        const test = allure.getCurrentTest()
        test.setDescription(description, type)
    }

    allureAttachment ({cid, name, content, type}) {
        const allure = this.getAllure(cid)
        if (!content || !allure) {
            return
        }

        if (type === 'application/json') {
            this.dumpJSON(allure, name, content)
        } else {
            allure.addAttachment(name, Buffer.from(content), type)
        }
    }

    allureStory ({ cid, storyName }) {
        const test = this.getAllure(cid).getCurrentTest()
        test.addLabel('story', storyName)
    }

    allureSeverity ({ cid, severity }) {
        const test = this.getAllure(cid).getCurrentTest()
        test.addLabel('severity', severity)
    }

    allureIssue ({ cid, issue }) {
        const test = this.getAllure(cid).getCurrentTest()
        test.addLabel('issue', issue)
    }

    allureTestId ({ cid, testId }) {
        const test = this.getAllure(cid).getCurrentTest()
        test.addLabel('testId', testId)
    }

    addBrowserOrDeviceParameter ({ cid, runner }) {
        const test = this.getAllure(cid).getCurrentTest()
        const { browserName, deviceName } = runner[cid]
        const targetName = browserName || deviceName || cid
        const version = runner[cid].version || runner[cid].platformVersion || ''
        const paramName = deviceName ? 'device' : 'browser'
        const paramValue = version ? `${targetName}-${version}` : targetName
        test.addParameter('argument', paramName, paramValue)
    }

    allureAddArgument ({ cid, name, value }) {
        const test = this.getAllure(cid).getCurrentTest()
        test.addParameter('argument', name, value)
    }

    static createStep (title, body, bodyLabel = 'attachment', status = PASSED) {
        const step = {
            title,
            body,
            bodyLabel,
            status
        }
        AllureReporter.tellReporter('runner:step', { step })
    }

    static feature (featureName) {
        AllureReporter.tellReporter('allure:feature', { featureName })
    }

    static addEnvironment (name, value) {
        AllureReporter.tellReporter('allure:addEnvironment', { name, value })
    }

    static addDescription (description, type) {
        AllureReporter.tellReporter('allure:addDescription', { description, type })
    }

    static createAttachment (name, content, type = 'text/plain') {
        AllureReporter.tellReporter('allure:attachment', {name, content, type})
    }

    static story (storyName) {
        AllureReporter.tellReporter('allure:story', { storyName })
    }

    static severity (severity) {
        AllureReporter.tellReporter('allure:severity', { severity })
    }

    static issue (issue) {
        AllureReporter.tellReporter('allure:issue', { issue })
    }

    static testId (testId) {
        AllureReporter.tellReporter('allure:testId', { testId })
    }

    static addArgument (name, value) {
        AllureReporter.tellReporter('allure:addArgument', { name, value })
    }

    static tellReporter (event, msg = {}) {
        process.send({ event, ...msg })
    }

    getAllure (cid) {
        if (this.allures[cid]) {
            return this.allures[cid]
        }

        const allure = new Allure()
        allure.setOptions({ targetDir: this.options.outputDir || 'allure-results' })
        this.allures[cid] = allure
        return this.allures[cid]
    }

    isAnyTestRunning (allure) {
        return allure.getCurrentSuite() && allure.getCurrentTest()
    }

    dumpJSON (allure, name, json) {
        allure.addAttachment(name, JSON.stringify(json, null, '    '), 'application/json')
    }
}

export default AllureReporter
