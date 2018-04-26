'use strict'
const reporter = require('./../../../build/reporter')

describe('Create Custom Step', () => {
    it('Case with custom failed step', () => {
        reporter.createStep('Custom Step Label', 'Custom Step Attachment Body', 'Custom Step Attachment Label', 'failed')
    })
})
