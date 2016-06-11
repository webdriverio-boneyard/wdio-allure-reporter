'use strict'

let expect = require('chai').expect
let helper = require('../helper')

describe('Screenshots', () => {
    beforeEach(helper.clean)

    it('can be taken in a "before all" task', () => {
        return helper.run(['screenshot-before-all', 'screenshot']).then((code) => {
            expect(code, 'wrong exit status code').to.equal(0)
            return helper.getResultsXML()
        }).then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(1)

            let screenshotFiles = helper.getResultFiles(['jpg', 'png'])
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(1)
        })
    })

    it('can be taken in an "after all" task', () => {
        return helper.run(['screenshot-after-all'], 'screenshot').then((code) => {
            expect(code, 'wrong exit status code').to.equal(0)
            return helper.getResultsXML()
        }).then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(1)
            let screenshotFiles = helper.getResultFiles(['jpg', 'png'])
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(1)
        })
    })

    it('can be taken during a test', () => {
        return helper.run(['screenshot'], 'screenshot').then((code) => {
            expect(code, 'wrong exit status code').to.equal(0)
            return helper.getResultsXML()
        }).then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(1)

            let screenshotFiles = helper.getResultFiles(['jpg', 'png'])
            expect(screenshotFiles, 'no screenshot files attached').to.have.lengthOf(1)
        })
    })
})
