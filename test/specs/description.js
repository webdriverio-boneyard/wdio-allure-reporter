import { expect } from 'chai'
import { clean, runMocha } from '../helper'

describe('Description', () => {
    beforeEach(clean)

    it('should detect description in test cases', () => {
        return runMocha(['description']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('Suite with description')
            expect(result('test-case > name').eq(0).text()).to.be.equal('First case - default description type')
            expect(result('test-case description[type="text"]').eq(0).text()).to.be.equal('Test description 1')

            expect(result('test-case > name').eq(1).text()).to.be.equal('Second case - text description type')
            expect(result('test-case description[type="text"]').eq(1).text()).to.be.equal('Test description 2')

            expect(result('test-case > name').eq(2).text()).to.be.equal('Third case - html description type')
            expect(result('test-case description[type="html"]').eq(0).text()).to.be.equal('Test description 3')

            expect(result('test-case > name').eq(3).text()).to.be.equal('Fourth case - markdown description type')
            expect(result('test-case description[type="markdown"]').eq(0).text()).to.be.equal('Test description 4')
        })
    })
})
