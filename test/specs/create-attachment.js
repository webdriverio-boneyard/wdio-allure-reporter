import { expect } from 'chai'
import {clean, getResultFiles, runMocha} from '../helper'
import cheerio from 'cheerio'

describe('create attachment', () => {
    beforeEach(clean)

    it('should create attachments in test cases', () => {
        return runMocha(['create-attachment']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            const txtAttachment = getResultFiles('txt')
            expect(txtAttachment, 'Plain text attachment file was not generated').to.have.lengthOf(1)
            expect(result('test-case attachment[title="Plain text attachment"]'),
                'Plain text attachment file was not added to general xml report').to.have.lengthOf(1)

            const jsonAttachment = getResultFiles('json')
            expect(jsonAttachment, 'JSON attachment file was not generated').to.have.lengthOf(1)
            expect(result('test-case attachment[title="JSON file attachment"]'),
                'JSON attachment file was not added to general xml report').to.have.lengthOf(1)

            const htmlAttachment = getResultFiles('html')
            expect(htmlAttachment, 'HTML attachment file was not generated').to.have.lengthOf(1)
            expect(result('test-case attachment[title="HTML file attachment"]'),
                'HTML attachment file was not added to general xml report').to.have.lengthOf(1)

            const pngAttachment = getResultFiles('png')
            expect(pngAttachment, 'PNG attachment file was not generated').to.have.lengthOf(1)
            expect(result('test-case attachment[title="PNG file attachment"]'),
                'PNG attachment file was not added to general xml report').to.have.lengthOf(1)

            const pngAttachmentResult = cheerio.load(result('test-case attachment[title="PNG file attachment"]')[0])
            expect(pngAttachmentResult('attachment').attr('size'),
                'PNG attachment did not have the correct size').to.equal('134596')
        })
    })
})
