import { expect } from 'chai'
import { clean, runMocha } from '../helper'

describe('Issue', () => {
    beforeEach(clean)

    it('should add issue to test cases', () => {
        return runMocha(['issue']).then(results => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal(
                'Suite with issues'
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
            ).to.be.equal('Test #2')
            expect(
                result('test-case label[name="issue"]')
                    .eq(0)
                    .attr('value')
            ).to.be.equal('1')
            expect(
                result('test-case label[name="issue"]')
                    .eq(1)
                    .attr('value')
            ).to.be.equal('2')
        })
    })
})
