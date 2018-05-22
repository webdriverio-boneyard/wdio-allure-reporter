import { expect } from 'chai'
import { clean, runMocha, getResultFiles } from '../helper'

describe('Screenshots', () => {
    beforeEach(clean)

    it('can be taken during a test', () => {
        return runMocha(['screenshot']).then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]('test-case')).to.have.lengthOf(1)

            const screenshotFiles = getResultFiles('png')
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(1)
            expect(results[0]('test-case attachment[title="Screenshot"]')).to.have.lengthOf(1)
        })
    })

    it('can take screenshot before each test and attach it accordingly', () => {
        return runMocha(['screenshot-before-each']).then((results) => {
            expect(results[0]('test-case')).to.have.lengthOf(2)
            expect(results[0]('test-case attachment[title="Screenshot"]')).to.have.lengthOf(2)

            const screenshotFiles = getResultFiles('png')
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(2)
        })
    })

    it('can be taken in an "before all" hook', () => {
        return runMocha(['screenshot-before-all']).then((results) => {
            expect(results).to.have.lengthOf(1)

            let screenshotFiles = getResultFiles(['jpg', 'png'])
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(1)
        })
    })

    it('can be taken in an "after" hook', () => {
        return runMocha(['screenshot-after']).then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]('test-case')).to.have.lengthOf(2)

            const screenshotFiles = getResultFiles('png')
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(1)
            expect(results[0]('test-case attachment[title="Screenshot"]')).to.have.lengthOf(1)
        })
    })

    it('can be taken in an "after each" hook', () => {
        return runMocha(['screenshot-after-each']).then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]('test-case')).to.have.lengthOf(1)

            const screenshotFiles = getResultFiles('png')
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(1)
            expect(results[0]('test-case attachment[title="Screenshot"]')).to.have.lengthOf(1)
        })
    })

    it('should not attach .png while disableWebdriverScreenshotsReporting enabled', () => {
        return runMocha(['screenshot'], './test/fixtures/wdio.conf/wdio.conf.mocha.noscr.js').then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]('test-case')).to.have.lengthOf(1)

            const screenshotFiles = getResultFiles('png')
            expect(screenshotFiles, 'screenshot file is exist').to.have.lengthOf(0)
            expect(results[0]('test-case attachment[title="Screenshot"]')).to.have.lengthOf(0)
        })
    })

    it('should not be reported while both disableWebdriverScreenshotsReporting and disableWebdriverStepsReporting are enabled', () => {
        return runMocha(['screenshot'], './test/fixtures/wdio.conf/wdio.conf.mocha.noinfo.js').then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]('test-case')).to.have.lengthOf(1)

            expect(results[0]('test-case attachment[title="Response (screenshot)"]')).to.have.lengthOf(0)
        })
    })
})
