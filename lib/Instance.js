import path from 'path'
import validateData from './utils/validateData'

/**
 * Stack of one instance unit
 */

class Instance {

    constructor (data, options) {

        validateData(data)
        this.instanceIdentifier = data.file;
        this.options = options
        this.allure = this.options.allure
        this.runtime = this.options.runtime
        this.context = data.file
        this.level = 0
        this.currentHooks = [];
        this.parents = [];
        this.queue = [];

        this.outputDir = this.allure.options.targetDir

    }

    startSuite (suite) {

        ++this.level
        this._pushParent(suite.title)
        // the root suite groups together in the dashboard
        var title = this.parents[0].title
        this._print('suite:start >', title)
        this._queue(() => {
            this.allure.startSuite(title)
        })

    }

    endSuite (suite) {

        --this.level
        this._popParent()
        var title = this.parents.length ? this.parents[0].title : this._getTitle(suite)
        this._print('test:end >', title)

        this._queue(() => {
            this.allure.endSuite()
        })

        this._flush();
        console.log(`Wrote Allure report for ${title} to [${this.outputDir}].`)

    }

    startTest (test) {
        var title = this._getTitle(test)
        var time = this._getTime()

        this._pushParent(title)
        this._print('test:start >', title)

        this._queue(() => {
            this.allure.startCase(title, time)
        })
    }

    passTest (test) {
        var parent = this._popParent();
        var title = this._getTitle(test)
        var time = this._getTime();
        
        this._print('test:pass >', title)
        this._queue(() => {
            this.allure.endCase('passed', time)
        })
    }

    failTest (test) {
        var title = this._getTitle(test)
        var time = this._getTime()

        var latestHook = this._getLatestHook()
        if(latestHook) {

            // when there is an error in an before/after hook
            // a virtual test case will be added to show the hook error
            // otherwise hooks will not show up in the results
            if(latestHook.currentTest === test.currentTest) {
                this._queue(() => {
                    this.allure.startCase(title, latestHook.timestamp)
                    this.allure.endCase('failed', test.err, time)
                })
                return;
            }

        }

        var parent = this._popParent();
        this._print('test:fail >', title, this.level)

        this._queue(() => {
            this.allure.endCase('failed', test.err, time)
        })
    }

    startHook (hook) {
        hook.timestamp = this._getTime()
        this.currentHooks.push(hook)
    }

    endHook (hook) {
        this.currentHooks.pop()
    }

    screenshot (screenshot) {
        var filename = this._getScreenshotFilename(screenshot),
            data = new Buffer(screenshot.data, 'base64'),
            allure = this.allure

        this._print('screenshot', filename)
        this._queue(() => {
            allure.addAttachment(filename, data)
        })
    }

    _popParent () {
        if(this.parents.length) {
            return this.parents.pop()
        }
    }

    _pushParent (parentTitle) {
        return this.parents.push({
            title: parentTitle,
            timestamp: this._getTime()
        })
    }

    _getLatestHook () {
        if(!this.currentHooks.length) {
            return null
        }

        return this.currentHooks[this.currentHooks.length-1]
    }

    _getTitle (test) {

        // parent suite tree and current title
        var tree = this.parents
            .map((parent) => {
                return parent.title
            })
            .concat([test.title])

        // except the root suite
        tree.shift()

        return tree.join(' >> ')

    }

    _getTime () {
        var d = new Date();
        return d.getTime();
    }

    _print () {
        if(this.options.verbose) {
            console.log.apply(this, arguments);
        }
    }

    _queue (fn) {
        this.queue.push(fn)
    }

    _flush () {
        this.queue.forEach((fn) => fn())
        this.queue = [];
    }

    _getScreenshotFilename (screenshot) {
        if(screenshot.filename) {
            return path.basename(screenshot.filename)
        } else {
            return screenshot.specHash + '-' + screenshot.cid + '.png'
        }
    }

}

export default Instance
