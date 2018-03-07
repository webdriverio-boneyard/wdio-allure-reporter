import { expect } from 'chai'
import { clean, runMocha } from '../helper'

describe('before hooks', () => {
    beforeEach(clean)

    it('should not appear in results when it is passing', () => {
        return runMocha(['before-all-passing']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('test-case')).to.have.lengthOf(1)
            expect(result('test-case > name').text()).to.equal('with passing test')
            expect(result('test-case').attr('status')).to.equal('passed')
        })
    })

    it('should report failed before-all hook', () => {
        return runMocha(['before-all-failing']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('test-case')).to.have.lengthOf(1)
            expect(result('test-case > name').text()).to.equal('"before all" hook')
            expect(result('test-case').attr('status')).to.equal('broken')
        })
    })

    it('should report before-each hook', () => {
        return runMocha(['before-each-failing']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('test-case')).to.have.lengthOf(1)
            expect(result('test-case > name').text()).to.equal('"before each" hook for "with passing test"')
            expect(result('test-case').attr('status')).to.equal('failed')
        })
    })
})
