import { expect } from 'chai'
import { clean, runFeatures } from '../helper'

describe('Cucumber test case', () => {
    beforeEach(clean)

    it('should add feature & scenario labels for cucumber test cases', () => {
        return runFeatures(['passing']).then((results) => {
            const result = results[0]
            expect(result('test-case label[name="feature"]').eq(0).attr('value')).to.equal('A passing feature')
            expect(result('test-case label[name="story"]').eq(0).attr('value')).to.equal('A passing scenario')
        })
    })
})
