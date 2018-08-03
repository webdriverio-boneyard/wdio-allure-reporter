import { expect } from 'chai'
import { clean, runMocha } from '../helper'

describe('test cases', () => {
    beforeEach(clean)

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

    it('should detect two pending test cases', () => {
        return runMocha(['several-pendings']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('test-case > name').eq(0).text()).to.be.equal('1. this is a skipped test without any code')
            expect(result('test-case').eq(0).attr('status')).to.be.equal('pending')
            expect(result('test-case > name').eq(1).text()).to.be.equal('2. this is another skipped test without any code')
            expect(result('test-case').eq(1).attr('status')).to.be.equal('pending')
            expect(result('test-case').eq(2).attr('status')).to.be.equal('passed')
            expect(result('test-case').eq(3).attr('status')).to.be.equal('failed')
        })
    })
})
