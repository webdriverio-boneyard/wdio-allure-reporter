import { expect } from 'chai'
import { clean, runMocha } from '../helper'

describe('test cases', () => {
    beforeEach(clean)

    it('should detect passed test case', () => {
        return runMocha(['passing']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A passing Suite')
            expect(result('test-case > name').text()).to.be.equal('with passing test')
            expect(result('test-case').attr('status')).to.be.equal('passed')
            expect(result('test-case parameter[kind="environment-variable"]')).to.have.lengthOf(2)
        })
    })

    it('should detect broken test case', () => {
        return runMocha(['broken']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A broken Suite')
            expect(result('test-case > name').text()).to.be.equal('with broken test')
            expect(result('test-case').attr('status')).to.be.equal('broken')
            expect(result('test-case step[status="broken"]')).to.have.lengthOf(1)
            expect(result('test-case step[status=""]')).to.have.lengthOf(0)
        })
    })

    it('should detect failed case', () => {
        return runMocha(['failing']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A failing Suite')
            expect(result('test-case > name').text()).to.be.equal('with failing test')
            expect(result('test-case').attr('status')).to.be.equal('failed')
        })
    })

    it('should detect pending test cases', () => {
        return runMocha(['pending']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A pending Suite')
            expect(result('test-case > name').eq(0).text()).to.be.equal('pending test')
            expect(result('test-case').eq(0).attr('status')).to.be.equal('pending')

            expect(result('test-case').eq(1).attr('start')).to.be.equal(result('test-case').eq(1).attr('stop'))
        })
    })

    it('should detect analytics labels in test case', () => {
        return runMocha(['passing']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A passing Suite')
            expect(result('test-case > name').text()).to.be.equal('with passing test')
            expect(result('test-case').attr('status')).to.be.equal('passed')
            expect(result('test-case parameter[kind="environment-variable"]')).to.have.lengthOf(2)
            expect(result('test-case label[name="language"]').eq(0).attr('value')).to.be.equal('javascript')
            expect(result('test-case label[name="framework"]').eq(0).attr('value')).to.be.equal('wdio')
        })
    })
})
