'use strict'

const {createAttachment} = require('./../../../build/runtime')

describe('Suite with attachments', () => {
    it('Add attachment with plain text attachment', () => {
        createAttachment('Plain text attachment', 'Plain text attachment')
    })

    it('Add attachment with JSON type', () => {
        createAttachment('JSON file attachment', {id: 1, name: 'Test user'}, 'application/json')
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

        createAttachment('HTML file attachment', html, 'text/html')
    })
})
