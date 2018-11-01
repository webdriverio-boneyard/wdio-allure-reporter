import { expect } from 'chai'
import {clean, runCucumber} from '../helper'

const configPath = './test/fixtures/wdio.conf/wdio.conf.cucumber.step.js'

describe('cucumber test scenario with steps', () => {
    beforeEach(clean)

    it('should add feature labels for test cases', () => {
        return runCucumber(['passing'], configPath).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]
            expect(result('test-case label[name="feature"]').eq(0).attr('value')).to.equal('A passing feature')
        })
    })

    it('should report one test per scenario - passed case', () => {
        return runCucumber(['passing'], configPath).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('test-case')).to.have.lengthOf(1)
            expect(result('test-case').attr('status')).to.be.equal('passed')
            expect(result('test-case > steps > step')).to.have.lengthOf(3)
            expect(result('test-case > steps > step > name').eq(0).text()).to.be.equal('I visit "/index.html"')
            expect(result('test-case > steps > step').eq(0).attr('status')).to.be.equal('passed')
            expect(result('test-case > steps > step > name').eq(1).text()).to.be.equal('I click the clickable region')
            expect(result('test-case > steps > step').eq(1).attr('status')).to.be.equal('passed')
            expect(result('test-case > steps > step > name').eq(2).text()).to.be.equal('I should get the result: 1')
            expect(result('test-case > steps > step').eq(2).attr('status')).to.be.equal('passed')
            expect(result('test-case label[name="thread"]')).to.have.lengthOf(1)
        })
    })

    it('should report one test per scenario - failed case', () => {
        return runCucumber(['failing'], configPath).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('test-case')).to.have.lengthOf(1)
            expect(result('test-case').attr('status')).to.be.equal('failed')
            expect(result('test-case > steps > step')).to.have.lengthOf(3)
            expect(result('test-case > steps > step > name').eq(0).text()).to.be.equal('I visit "/index.html"')
            expect(result('test-case > steps > step').eq(0).attr('status')).to.be.equal('passed')
            expect(result('test-case > steps > step > name').eq(1).text()).to.be.equal('I click the clickable region')
            expect(result('test-case > steps > step').eq(1).attr('status')).to.be.equal('passed')
            expect(result('test-case > steps > step > name').eq(2).text()).to.be.equal('I run failing step')
            expect(result('test-case > steps > step').eq(2).attr('status')).to.be.equal('failed')
        })
    })

    it('should report one test per scenario - broken case', () => {
        return runCucumber(['broken'], configPath).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('test-case')).to.have.lengthOf(1)
            expect(result('test-case').attr('status')).to.be.equal('broken')
            expect(result('test-case > steps > step')).to.have.lengthOf(3)
            expect(result('test-case > steps > step > name').eq(0).text()).to.be.equal('I visit "/index.html"')
            expect(result('test-case > steps > step').eq(0).attr('status')).to.be.equal('passed')
            expect(result('test-case > steps > step > name').eq(1).text()).to.be.equal('I click the clickable region')
            expect(result('test-case > steps > step').eq(1).attr('status')).to.be.equal('passed')
            expect(result('test-case > steps > step > name').eq(2).text()).to.be.equal('I try to use undefined step')
            expect(result('test-case > steps > step').eq(2).attr('status')).to.be.equal('broken')
        })
    })

    it('should report one test per scenario - pending case', () => {
        return runCucumber(['withPending'], configPath).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('test-case')).to.have.lengthOf(1)
            expect(result('test-case').attr('status')).to.be.equal('failed')
            expect(result('test-case > steps > step')).to.have.lengthOf(4)
            expect(result('test-case > steps > step > name').eq(0).text()).to.be.equal('I visit "/index.html"')
            expect(result('test-case > steps > step').eq(0).attr('status')).to.be.equal('passed')
            expect(result('test-case > steps > step > name').eq(1).text()).to.be.equal('I click the clickable region')
            expect(result('test-case > steps > step').eq(1).attr('status')).to.be.equal('passed')
            expect(result('test-case > steps > step > name').eq(2).text()).to.be.equal('I run failing step')
            expect(result('test-case > steps > step').eq(2).attr('status')).to.be.equal('failed')
            expect(result('test-case > steps > step > name').eq(3).text()).to.be.equal('I see steps after as pending')
            expect(result('test-case > steps > step').eq(3).attr('status')).to.be.equal('pending')
        })
    })

    it('should report one test per scenario - scenario pending case', () => {
        return runCucumber(['withPendingScenario'], configPath).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('test-case')).to.have.lengthOf(2)
            expect(result('test-case').eq(0).attr('status')).to.be.equal('failed')
            expect(result('test-case').eq(1).attr('status')).to.be.equal('pending')
            expect(result('test-case:nth-child(1) > steps > step')).to.have.lengthOf(3)
            expect(result('test-case:nth-child(2) > steps > step')).to.have.lengthOf(3)
            expect(result('test-case:nth-child(1) > steps > step > name').eq(0).text()).to.be.equal('I visit "/index.html"')
            expect(result('test-case:nth-child(1) > steps > step').eq(0).attr('status')).to.be.equal('passed')
            expect(result('test-case:nth-child(1) > steps > step > name').eq(1).text()).to.be.equal('I click the clickable region')
            expect(result('test-case:nth-child(1) > steps > step').eq(1).attr('status')).to.be.equal('passed')
            expect(result('test-case:nth-child(1) > steps > step > name').eq(2).text()).to.be.equal('I run failing step')
            expect(result('test-case:nth-child(1) > steps > step').eq(2).attr('status')).to.be.equal('failed')
            expect(result('test-case:nth-child(2) > steps > step > name').eq(0).text()).to.be.equal('I visit "/index.html"')
            expect(result('test-case:nth-child(2) > steps > step').eq(0).attr('status')).to.be.equal('pending')
            expect(result('test-case:nth-child(2) > steps > step > name').eq(1).text()).to.be.equal('I click the clickable region')
            expect(result('test-case:nth-child(2) > steps > step').eq(1).attr('status')).to.be.equal('pending')
            expect(result('test-case:nth-child(2) > steps > step > name').eq(2).text()).to.be.equal('I run failing step')
            expect(result('test-case:nth-child(2) > steps > step').eq(2).attr('status')).to.be.equal('pending')
        })
    })
})
