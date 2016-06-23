'use strict'

let expect = require('chai').expect
let helper = require('../helper')

describe('Screenshots', () => {
    beforeEach(helper.clean)

    it('can be taken during a test', () => {
        return helper.run(['screenshot']).then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]('test-case')).to.have.lengthOf(1)

            const screenshotFiles = helper.getResultFiles('png')
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(1)
            expect(results[0]('test-case attachment[title="Screenshot"]')).to.have.lengthOf(1)
        })
    })

    it('can take screenshot before each test and attach it accordingly', () => {
        return helper.run(['screenshot-before-each']).then((results) => {
            expect(results[0]('test-case')).to.have.lengthOf(2)
            expect(results[0]('test-case attachment[title="Screenshot"]')).to.have.lengthOf(2)

            const screenshotFiles = helper.getResultFiles('png')
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(2)
        })
    })

    it('can be taken in an "before all" hook', () => {
        return helper.run(['screenshot-before-all']).then((results) => {
            expect(results).to.have.lengthOf(1)

            let screenshotFiles = helper.getResultFiles(['jpg', 'png'])
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(1)
        })
    })
})
