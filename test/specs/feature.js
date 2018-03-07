import { expect } from 'chai'
import { clean, runMocha } from '../helper'

describe('Features', () => {
    beforeEach(clean)

    it('should detect features in test cases', () => {
        return runMocha(['feature']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('Suite with features')
            expect(result('test-case > name').eq(0).text()).to.be.equal('First case')
            expect(result('test-case > name').eq(1).text()).to.be.equal('Second case')
            expect(result('test-case label[name="feature"]').eq(0).attr('value')).to.be.equal('Test feature 1')
            expect(result('test-case label[name="feature"]').eq(1).attr('value')).to.be.equal('Test feature 2')
        })
    })
})
