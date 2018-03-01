'use strict'

const reporter = require('./../../../build/reporter')
const fs = require('fs')

describe('Suite with attachments', () => {
    it('Add attachment with plain text attachment', () => {
        reporter.createAttachment('Plain text attachment', 'Plain text attachment')
    })

    it('Add attachment with JSON type', () => {
        reporter.createAttachment('JSON file attachment', {id: 1, name: 'Test user'}, 'application/json')
    })

    it('Add attachment with HTML type', () => {
        const html = '<html>\n' +
            '<body>\n' +
            '\n' +
            '<h1>My First Heading</h1>\n' +
            '\n' +
            '<p>My first paragraph.</p>\n' +
            '\n' +
            '</body>\n' +
            '</html>\n'

        reporter.createAttachment('HTML file attachment', html, 'text/html')
    })

    it('Add attachment with PNG type', () => {
        const png = fs.readFileSync('./test/resources/image.png', 'base64')

        reporter.createAttachment('PNG file attachment', png, 'image/png')
    })
})
