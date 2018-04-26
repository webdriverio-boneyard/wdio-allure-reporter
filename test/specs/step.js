import { expect } from 'chai'
import { clean, runMocha, getResultFiles, getResultFileValue } from '../helper'

describe('Step', () => {
    beforeEach(clean)

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
        return runMocha(['step']).then(() => {
            const txtAttachment = getResultFiles('txt')
            expect(txtAttachment).to.have.lengthOf(1)

            const attachmentValue = getResultFileValue(txtAttachment)
            expect(attachmentValue).to.be.equal('Custom Step Attachment Body')
        })
    })

    it('should set default status', () => {
        return runMocha(['step']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('step').eq(0).attr('status')).to.be.equal('passed')
        })
    })

    it('should set custom status', () => {
        return runMocha(['step-failed']).then((results) => {
            expect(results).to.have.lengthOf(1)

            const result = results[0]
            expect(result('step').eq(0).attr('status')).to.be.equal('failed')
        })
    })
})
