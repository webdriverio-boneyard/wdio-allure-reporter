import { expect } from 'chai'
import { clean, run, getResultFiles } from '../helper'

describe('Screenshots', () => {
    beforeEach(clean)

    it('can be taken during a test', () => {
        return run(['screenshot']).then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]('test-case')).to.have.lengthOf(1)

            const screenshotFiles = getResultFiles('png')
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(1)
            expect(results[0]('test-case attachment[title="Screenshot"]')).to.have.lengthOf(1)
        })
    })

    it('can take screenshot before each test and attach it accordingly', () => {
        return run(['screenshot-before-each']).then((results) => {
            expect(results[0]('test-case')).to.have.lengthOf(2)
            expect(results[0]('test-case attachment[title="Screenshot"]')).to.have.lengthOf(2)

            const screenshotFiles = getResultFiles('png')
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(2)
        })
    })

    it('can be taken in an "before all" hook', () => {
        return run(['screenshot-before-all']).then((results) => {
            expect(results).to.have.lengthOf(1)

            let screenshotFiles = getResultFiles(['jpg', 'png'])
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(1)
        })
    })
})
