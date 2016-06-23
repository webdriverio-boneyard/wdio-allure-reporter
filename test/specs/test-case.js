import {expect} from 'chai'
import {clean, run} from '../helper'

describe('test cases', () => {
    beforeEach(clean)

    it('should detect passed test case', () => {
        return run(['passing']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A passing Suite')
            expect(result('test-case > name').text()).to.be.equal('with passing test')
            expect(result('test-case').attr('status')).to.be.equal('passed')
            expect(result('test-case parameter[kind="environment-variable"]')).to.have.lengthOf(2)
        })
    })

    it('should detect broken test case', () => {
        return run(['broken']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A broken Suite')
            expect(result('test-case > name').text()).to.be.equal('with broken test')
            expect(result('test-case').attr('status')).to.be.equal('broken')
            expect(result('test-case step[status="broken"]')).to.have.lengthOf(1)
        })
    })

    it('should detect passed failed case', () => {
        return run(['failing']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A failing Suite')
            expect(result('test-case > name').text()).to.be.equal('with failing test')
            expect(result('test-case').attr('status')).to.be.equal('failed')
        })
    })
})
