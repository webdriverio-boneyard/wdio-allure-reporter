import { expect } from 'chai'
import { clean, runMocha } from '../helper'

describe('environments', () => {
    beforeEach(clean)

    it('should detect environments in test cases', () => {
        return runMocha(['environment']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('Suite with environments')
            expect(result('test-case:first-of-type > name').text()).to.be.equal('First case')
            expect(result('test-case:last-of-type > name').text()).to.be.equal('Second case')
            expect(result('test-case:first-of-type parameter')).to.have.lengthOf(4)
            expect(result('test-case:last-of-type parameter')).to.have.lengthOf(4)

            expect(result('test-case parameter[name="ENVIRONMENT"]').eq(0).attr('value')).to.be.equal('TEST')
            expect(result('test-case parameter[name="ENVIRONMENT"]').eq(1).attr('value')).to.be.equal('Firefox')
        })
    })
})
