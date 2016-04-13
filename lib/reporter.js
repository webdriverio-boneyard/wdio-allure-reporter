import path from 'path'
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
        this.level = 0;
        this.currentHooks = [];
        this.parents = [];

        this.allure = new Allure()
        this.runtime = new Runtime(this.allure)

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
            ++this.level
            this.pushParent(suite.title)
            // the root suite groups together in the dashboard
            var title = this.parents[0]
            this.print('suite:start', title)
            this.allure.startSuite(title)
        })

        this.on('suite:end', (suite) => {
            --this.level
            this.popParent()
            var title = this.parents.length ? this.parents[0] : this.getTitle(suite)
            this.print('test:end', title)
            this.allure.endSuite()
            console.log(`Wrote Allure report for ${title} to [${this.outputDir}].`)
        })

        this.on('test:start', (test) => {
            var title = this.getTitle(test)
            this.pushParent(title)
            this.print('test:start', title)
            this.allure.startCase(title)
        })

        this.on('test:pending', (test) => {
            this.popParent()
            var title = this.getTitle(test)
            this.print('test:pending', title)
            this.allure.pendingCase(title)
        })

        this.on('test:pass', (test) => {
            this.popParent()
            var title = this.getTitle(test)
            this.print('test:pass', title)
            this.allure.endCase('passed', null)
        })

        this.on('test:fail', (test) => {

            var title = this.getTitle(test)

            var latestHook = this.getLatestHook()
            if(latestHook) {

                // when there is an error in an before/after hook
                // a virtual test case will be added to show the hook error
                // otherwise hooks will not show up in the results
                if(latestHook.currentTest === test.currentTest) {
                    this.allure.startCase(title)
                    this.allure.endCase('failed', test.err)
                    return;
                }

            }

            this.popParent()
            this.print('test:fail', title)
            this.allure.endCase('failed', test.err)

        })

        // track chains of hooks to later determine whether a test or a hook failed
        this.on('hook:start', (hook) => {
            this.currentHooks.push(hook);
        })

        this.on('hook:end', (hook) => {
            this.currentHooks.pop();
        })

        this.on('runner:screenshot', (screenshot) => {

            var filename = this.getScreenshotFilename(screenshot),
                data = new Buffer(screenshot.data, 'base64')

            this.print('screenshot', filename)
            this.allure.addAttachment(filename, data)

        })


    }

    popParent() {
        if(this.parents.length) {
            return this.parents.pop()
        }
    }

    pushParent(parent) {
        return this.parents.push(parent)
    }

    getProjectName() {
        return this.options.projectName || 'Unknown Project';
    }

    getLatestHook () {
        if(!this.currentHooks.length) {
            return null
        }

        return this.currentHooks[this.currentHooks.length-1]
    }

    print (source, message) {
        if(this.options.verbose) {
            var delimiter = '\t'
            console.log.apply(this, [source + delimiter].concat(message));
        }
    }

    getTitle (test) {

        // parent suite tree and current title
        var tree = this.parents.concat([test.title])

        // except the root suite
        tree.shift()

        return tree.join(' >> ')

    }

    getScreenshotFilename (screenshot) {
        if(screenshot.filename) {
            return path.basename(screenshot.filename)
        } else {
            return screenshot.specHash + '-' + screenshot.cid + '.png'
        }
    }

}

export default AllureReporter
