import { expect } from 'chai'
import {clean, runCucumber} from '../helper'

describe('Cucumber test cases', () => {
    beforeEach(clean)

    it('should add feature & scenario labels for cucumber test cases', () => {
        return runCucumber(['passing']).then((results) => {
            const result = results[0]
            expect(result('test-case label[name="feature"]').eq(0).attr('value')).to.equal('A passing feature')
            expect(result('test-case label[name="story"]').eq(0).attr('value')).to.equal('A passing scenario')
        })
    })

    it('should detect passed case', () => {
        return runCucumber(['passing']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('test-case').eq(0).attr('status')).to.be.equal('passed')
            expect(result('test-case').eq(1).attr('status')).to.be.equal('passed')
            expect(result('test-case').eq(2).attr('status')).to.be.equal('passed')
        })
    })

    it('should detect failed case', () => {
        return runCucumber(['failing']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('test-case').eq(2).attr('status')).to.be.equal('failed')
        })
    })

    it('should detect broken case', () => {
        return runCucumber(['broken']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('test-case').eq(2).attr('status')).to.be.equal('broken')
        })
    })
})
