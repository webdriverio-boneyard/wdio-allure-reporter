import { expect } from 'chai'
import { clean, runMocha, getResultFiles, getResultFileValue } from '../helper'

describe('Step', () => {
    beforeEach(clean)

    it('should add test to the report', () => {
        return runMocha(['step']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('ns2\\:test-suite > name').text()).to.be.equal('Create Custom Step')
        })
    })
    it('should add case to the test', () => {
        return runMocha(['step']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('test-case > name').eq(0).text()).to.be.equal('Case with custom step')
        })
    })

    it('should add step to the case', () => {
        return runMocha(['step']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('step > name').eq(0).text()).to.be.equal('Custom Step Label')
        })
    })

    it('should have attachment label', () => {
        return runMocha(['step']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('test-case attachment[title="Custom Step Attachment Label"]')).to.have.lengthOf(1)
        })
    })
    it('should have attachment txt', () => {
        return runMocha(['step']).then((results) => {
            const txtAttachment = getResultFiles('txt')
            expect(txtAttachment).to.have.lengthOf(1)

            const attachmentValue = getResultFileValue(txtAttachment)
            expect(attachmentValue).to.be.equal('Custom Step Attachment Body')
        })
    })
})
