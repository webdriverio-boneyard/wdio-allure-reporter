import path from 'path'
import validate from './utils/validate'

/**
 * Stack of one instance unit
 */

class Instance {

    constructor (data, options) {

        validate(data)
        this.instanceIdentifier = data.specs[0];
        this.options = options
        this.allure = this.options.allure
        this.runtime = this.options.runtime
        this.context = data.file
        
        this.currentCaseResult = null
        this.queue = []
        this.stack = []

        this.outputDir = this.allure.options.targetDir

    }

    _getLevel() {
        return this.stack.length;
    }

    _getStackTop(offset) {
        offset = offset || 1
        let len = this.stack.length
        if((len !== undefined) && (len>=offset)) {
            return this.stack[len-offset];
        }
    }

    _isHookActive() {
        return this._isActive('hook')
    }

    _isTestActive() {
        return this._isActive('test') || this._isActive('virtual')
    }

    _isActive(kind) {
        return this._getStackTop().kind === kind
    }

    _pushStack(item, kind) {
        item.kind = kind
        this.stack.push(item)
    }

    _popStack(kinds) {

        let topStackItem = this._getStackTop()
        kinds = kinds instanceof Array ? kinds : [kinds]

        if(!this.stack.length) {
            return;
        }

        let match = kinds.filter((kind) => {
            return (topStackItem.kind === kind);
        }).length > 0;

        if(match) {
            return this.stack.pop()
        }

    }

    startSuite (suite) {

        this._endSuite()

        this._pushStack(suite, 'suite')

        // the root suite groups together in the dashboard
        var title = this.stack[0].title
        this._print('suite:start', title)

        this._queue(() => {
            this.allure.startSuite(title)
        })

    }

    endSuite(suite) {
               
        // end last suite
        return this._endSuite();

    }

    _endSuite () {

        // when there is an pending case, end it
        this._endCase(null, true);

        let title
        let suite = this._popStack('suite')

        if(!suite) {
            return;
        }

        this._print('suite:end', suite.title);

        this._queue(() => {
            this.allure.endSuite()
        })

        if(!this.stack.length) {
            // re-apply the root suite
            this._pushStack(suite, 'suite')
            this._flush();
        } else if((this.stack.length === 1) && (this._getStackTop().kind === 'suite')) {
            this._flush()
        }

    }

    endInstance () {
        return this.endSuite()
    }

    startTest (test) {

        // end any open case
        this._endCase(null, true);

        let title = this._getTitle(test.title)
        this._print('test:start', title)
        this._startCase(title)

    }

    passTest (test) {

        let title = this._getTitle(test.title)
        let time = this._getTime();

        this._print('test:pass', title)
        this._getStackTop().result = {
            status: 'passed',
            time: time
        }

    }

    failTest (test) {

        let title = this._getTitle()
        let time = this._getTime()

        if(this._isHookActive()) {

            // after hooks need to end the previous test first
            this._startVirtualErrorCase(test)
            this._print('hook:fail', title)

            let len = this.stack.length;

            // hook
            if(!this.stack[len-1].result) {
                this.stack[len-1].result = {
                    time: this._getStackTop().timestamp,
                    status: 'broken'
                }
            }
            this.stack[len-1].result.err = test.err

            // test
            if(!this.stack[len-2].result) {
                this.stack[len-2].result = {
                    time: this._getStackTop().timestamp,
                    status: 'broken'
                }
            }
            this.stack[len-2].result.err = test.err

        } else {

            title = this._getTitle(test.title)
            this._getStackTop().result = {
                status: 'failed',
                err: test.err,
                time: time
            }
            this._print('test:fail', title)

        }        
        
    }

    endTest (test) {

        if(test.pending) {

            this._getStackTop().result = {
                status: 'pending',
                err: {
                    message: 'canceled'
                },
                time: this._getTime()
            };

            this._endCase('test');

        }
        
    }

    startHook (hook) {
        this._endHook()
        hook.timestamp = this._getTime()
        this._pushStack(hook, 'hook')
    }

    endHook (hook) {
        this._popStack('hook')
    }

    _endHook () {
        let topStackItem = this._popStack('hook')

        if(!topStackItem) {
            return
        }

        // if(topStackItem.kind === 'virtual') {
            this._endCase('virtual')
        // }
    }

    screenshot (screenshot) {

        var filename = this._getScreenshotFilename(screenshot),
            data = new Buffer(screenshot.data, 'base64'),
            time = this._getTime()

        if(this._isHookActive()) {
            this._startVirtualErrorCase(screenshot)
        } else if(!this._isTestActive()) {
            this._startCase(this._getTitle(), time)
        }

        this._print('Screenshot taken from', this._getStackTop().kind, 'in', this._getTitle())

        this._queue(() => {
            this.allure.addAttachment(filename, data)
        })

    }

    _startVirtualErrorCase (item) {

        let hook = this._getStackTop()
        let title = this._getTitle(item.title) + hook.title

        if(this.stack.length >= 2) {
            let parentKind = this.stack[this.stack.length-2].kind;
            if(parentKind === 'test') {
                this._endCase('test', true)
            } else if(parentKind !== 'suite') {
                // a virtual case already started
                this._endCase('virtual', true);
            }
        }

        this._popStack('hook')
        this._startCase(this._getTitle(item.title), hook.timestamp, 'virtual')

        if(!hook.result) {
            hook.result = {
                status: 'broken',
                time: this._getTime()
            }
        }
        if(!this._getStackTop().result) {
            this._getStackTop().result = {
                status: 'broken',
                time: this._getTime()
            }
        }

        if(item.err) {
            hook.result.err = item.err

            // also set test to failed
            this._getStackTop().result.err = item.err
        }

        this._pushStack(hook, 'hook')

    }

    _endCase (type, force) {

        type = type || ['test', 'virtual']

        this._endHook()
        var test = this._popStack(type);


        if(!test) {
            return
        }

        if(!test.result) {
            if(force) {
                test.result = {
                    status: 'broken',
                    err: 'Test did not finish.',
                    time: this._getTime()
                }
            } else {
                return
            }
        }

        var status = test.result.status || 'broken',
            err = test.result.err,
            time = test.result.time || this._getTime();

        this._queue(() => {
            if(status === 'passed') {
                this.allure.endCase(status, time)
            } else {
                this.allure.endCase(status, err, time)
            }
        })

    }

    _startCase (title, time, kind) {

        kind = kind || 'test'
        time = time || this._getTime()

        if(this._getStackTop().kind !== 'suite') {
            // skip starting tests outside of a suite
            return;
        }

        this._pushStack({
            title: title,
            time: time
        }, kind)

        this._queue(() => {
            this.allure.startCase(title, time)
        })

    }

    _getTitle (title) {

        // parent suite tree and current title
        let tree = this.stack
            .map((item) => {
                return item.title
            });

        if(title) {
            tree = tree.concat(title instanceof Array ? title : [title])
        }

        // except the root suite
        let rootSuiteTitle = tree.shift()

        if(!tree.length) {
            return rootSuiteTitle
        }

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
        let title = this._getTitle()
        this.queue.forEach((fn) => fn())
        this.queue = [];
        console.log(`Wrote Allure report for ${title} to [${this.outputDir}].`)
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
