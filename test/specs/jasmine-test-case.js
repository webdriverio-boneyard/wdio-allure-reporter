import { expect } from 'chai'
import { clean, runJasmine } from '../helper'

describe('jasmine test cases', () => {
    beforeEach(clean)

    it('should detect passed test case', () => {
        return runJasmine(['passing']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A passing Suite')
            expect(result('test-case > name').text()).to.be.equal('with passing test')
            expect(result('test-case').attr('status')).to.be.equal('passed')
            expect(result('test-case parameter[kind="environment-variable"]')).to.have.lengthOf(2)
        })
    })

    it('should detect broken test case', () => {
        return runJasmine(['broken']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A broken Suite')
            expect(result('test-case > name').text()).to.be.equal('with broken test')
            expect(result('test-case').attr('status')).to.be.equal('failed')
            expect(result('test-case step[status="failed"]')).to.have.lengthOf(1)
            expect(result('test-case step[status=""]')).to.have.lengthOf(0)
        })
    })

    it('should detect passed failed case', () => {
        return runJasmine(['failing']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A failing Suite')
            expect(result('test-case > name').text()).to.be.equal('with failing test')
            expect(result('test-case').attr('status')).to.be.equal('failed')
        })
    })

    it('should detect pending test cases', () => {
        return runJasmine(['pending']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A pending Suite')
            expect(result('test-case > name').eq(0).text()).to.be.equal('undefined')
            expect(result('test-case').eq(0).attr('status')).to.be.equal('pending')
        })
    })

    it('should detect pending test cases', () => {
        return runJasmine(['pending-without-function']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A pending Suite')
            expect(result('test-case > name').eq(0).text()).to.be.equal('test without function')
            expect(result('test-case').eq(0).attr('status')).to.be.equal('pending')
        })
    })
})
