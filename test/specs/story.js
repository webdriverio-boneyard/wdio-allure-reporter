import { expect } from 'chai'
import { clean, run } from '../helper'

describe('Stories', () => {
    beforeEach(clean)

    it.only('should add stories to test cases', () => {
        return run(['story']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('Suite with stories')
            expect(result('test-case > name').eq(0).text()).to.be.equal('Test #1')
            expect(result('test-case > name').eq(1).text()).to.be.equal('Test #2')
            expect(result('test-case label[name="story"]').eq(0).attr('value')).to.be.equal('Story label for Test #1')
            expect(result('test-case label[name="story"]').eq(1).attr('value')).to.be.equal('Story label for Test #2')
        })
    })
})
