import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import AllureReporter from '../../build/reporter'
const {expect} = chai
chai.use(sinonChai)

describe('Browser / Device name in test "argument" parameters', function () {
    describe('addBrowserOrDeviceParameter method', function () {
        before(function () {
            this.baseReporter = { epilogue: sinon.stub() }
            this.allureReporter = new AllureReporter(this.baseReporter, {}, {})
            this.addParameterSpy = sinon.spy()
            this.allureReporter.getAllure = () => ({getCurrentTest: () => ({addParameter: this.addParameterSpy})})
        })

        afterEach(function () {
            this.addParameterSpy.resetHistory()
        })

        it('Should handle selenium case', function () {
            this.allureReporter.addBrowserOrDeviceParameter({ cid: '0-0',
                runner: {
                    '0-0': {
                        browserName: 'firefox',
                        version: '1.2.3'
                    }
                }
            })

            expect(this.addParameterSpy.callCount).to.equal(1)
            expect(this.addParameterSpy).to.have.been.calledWith('argument', 'browser', 'firefox-1.2.3')
        })

        it('Should handle appium case', function () {
            this.allureReporter.addBrowserOrDeviceParameter({ cid: '0-0',
                runner: {
                    '0-0': {
                        deviceName: 'Android GoogleAPI Emulator',
                        platformVersion: '7.1'
                    }
                }
            })

            expect(this.addParameterSpy).to.have.been.calledOnceWith('argument', 'device', 'Android GoogleAPI Emulator-7.1')
        })

        it('Should default to "browser" and cid when caps are missing', function () {
            this.allureReporter.addBrowserOrDeviceParameter({ cid: '0-0',
                runner: {
                    '0-0': {}
                }
            })

            expect(this.addParameterSpy).to.have.been.calledOnceWith('argument', 'browser', '0-0')
        })
    })

    describe('Event suite:start', function () {
        before(function () {
            this.baseReporter = { epilogue: sinon.stub() }
            this.runner = { '0-0': { browserName: 'chrome' } }
            this.firstSuiteStartParam = {
                cid: '0-0',
                uid: 'Main',
                title: 'Main1',
                parent: null,
                runner: this.runner
            }
            this.secondSuiteStartParam = {
                cid: '0-0',
                uid: 'SomeTest1',
                title: 'SomeTest',
                parent: 'Main1',
                runner: this.runner
            }
            this.testStartParam = {
                cid: '0-0',
                uid: 'My foobar test12',
                title: 'My foobar test',
                parent: 'Main1',
                runner: this.runner
            }
        })

        it('Should call addBrowserOrDeviceParameter when using cucumber', function () {
            // Instanciate a new AllureReporter, configured to use cucumber style
            this.allureReporter = new AllureReporter(this.baseReporter, {}, { useCucumberStepReporter: true })
            const addBrowserOrDeviceParameterStub = sinon.stub(this.allureReporter, 'addBrowserOrDeviceParameter')

            // Listen to suite:start events, on 2nd call, assert that the expectations are met
            let counter = 0
            const runner = this.runner
            this.allureReporter.on('suite:start', function () {
                counter++
                if (counter === 2) {
                    // Verify that we correctly called our function
                    expect(addBrowserOrDeviceParameterStub).to.have.been.calledOnceWith({
                        cid: '0-0',
                        runner
                    })
                }
            })

            // Emit suite:start twice, once without parent, once with parent = uid of previous call
            this.allureReporter.emit('suite:start', this.firstSuiteStartParam)
            this.allureReporter.emit('suite:start', this.secondSuiteStartParam)
        })

        it('Should call addBrowserOrDeviceParameter when using mocha or allure', function () {
            this.allureReporter = new AllureReporter(this.baseReporter, {}, {})
            const addBrowserOrDeviceParameterStub = sinon.stub(this.allureReporter, 'addBrowserOrDeviceParameter')

            // Listen to suite:start events, on 2nd call, assert that the expectations are met
            const runner = this.runner
            this.allureReporter.on('test:start', function () {
                // Verify that we correctly called our function
                expect(addBrowserOrDeviceParameterStub).to.have.been.calledOnceWith({
                    cid: '0-0',
                    runner
                })
            })

            // Emit suite:start twice, once without parent, once with parent = uid of previous call
            this.allureReporter.emit('suite:start', this.firstSuiteStartParam)
            this.allureReporter.emit('test:start', this.testStartParam)
        })
    })
})
