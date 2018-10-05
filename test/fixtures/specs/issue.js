'use strict'

const reporter = require('./../../../build/reporter')

describe('Suite with issues', () => {
    console.log('Running suite')
    it('Test #1', () => {
        reporter.issue('1')
    })

    it('Test #2', () => {
        reporter.issue('2')
    })
})
