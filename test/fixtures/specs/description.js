'use strict'

const reporter = require('./../../../build/reporter')

describe('Suite with description', () => {
    it('First case - default description type', () => {
        reporter.addDescription('Test description 1')
    })

    it('Second case - text description type', () => {
        reporter.addDescription('Test description 2', 'text')
    })

    it('Third case - html description type', () => {
        reporter.addDescription('Test description 3', 'html')
    })

    it('Fourth case - markdown description type', () => {
        reporter.addDescription('Test description 4', 'markdown')
    })
})
