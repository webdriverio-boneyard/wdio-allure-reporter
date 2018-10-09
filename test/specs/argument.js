import { expect } from 'chai'
import { clean, runMocha } from '../helper'

describe('Add argument', () => {
    beforeEach(clean)

    it('should add argument to test cases', () => {
        return runMocha(['argument']).then(results => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal(
                'Suite with custom argument'
            )
            expect(
                result('test-case > name')
                    .eq(0)
                    .text()
            ).to.be.equal('Test #1')
            expect(
                result('test-case > name')
                    .eq(1)
                    .text()
            ).to.be.equal('Test #1')
            expect(
                result('test-case parameter[name="os"]')
                    .eq(0)
                    .attr('value')
            ).to.be.equal('osx')
            expect(
                result('test-case parameter[name="os"]')
                    .eq(1)
                    .attr('value')
            ).to.be.equal('windows')
        })
    })
})
