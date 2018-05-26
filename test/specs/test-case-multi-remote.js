import { expect } from 'chai'
import { clean, runMocha } from '../helper'

describe('Multi-browser test case', () => {
    beforeEach(clean)
    it('should not report browser commands', () => {
        return runMocha(['test-case-multi-browser'], './test/fixtures/wdio.conf/wdio-multi-remote.conf.js').then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('test-case step')).to.have.lengthOf(0)
        })
    })
})
