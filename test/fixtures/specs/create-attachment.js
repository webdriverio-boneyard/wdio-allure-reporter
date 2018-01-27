'use strict'

const reporter = require('./../../../build/reporter')

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
})
