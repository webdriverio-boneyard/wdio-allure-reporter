import { expect } from 'chai'
import { clean, run } from '../helper'

describe('before hooks', () => {
    beforeEach(clean)

    it('should not appear in results when it is passing', () => {
        return run(['before-all-passing']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('test-case')).to.have.lengthOf(1)
            expect(result('test-case > name').text()).to.equal('with passing test')
            expect(result('test-case').attr('status')).to.equal('passed')
        })
    })

    it('should report failed before-all hook', () => {
        return run(['before-all-failing']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('test-case')).to.have.lengthOf(1)
            expect(result('test-case > name').text()).to.equal('"before all" hook')
            expect(result('test-case').attr('status')).to.equal('broken')
        })
    })

    it('should report before-each hook', () => {
        return run(['before-each-failing']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('test-case')).to.have.lengthOf(1)
            expect(result('test-case > name').text()).to.equal('"before each" hook for "with passing test"')
            expect(result('test-case').attr('status')).to.equal('failed')
        })
    })
})
