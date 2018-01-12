import { expect } from 'chai'
import { clean, run } from '../helper'

describe('Features', () => {
    beforeEach(clean)

    it('should detect features in test cases', () => {
        return run(['feature']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('Suite with features')
            expect(result('test-case > name').eq(0).text()).to.be.equal('First case')
            expect(result('test-case > name').eq(1).text()).to.be.equal('Second case')
            expect(result('test-case').attr('status')).to.be.equal('passed')
            expect(result('test-case label[value="Test feature 1"]').to.have.lengthOf
            expect(result('test-case label[value="Test feature 2"]')).eq(1).to.be.equal('Test feature 2')
        })
    })
})
