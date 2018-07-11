'use strict'

const reporter = require('./../../../build/reporter')

describe('Suite with severities', () => {
    it('Test #1', () => {
        reporter.severity('test1')
    })

    it('Test #2', () => {
        reporter.severity('test2')
    })
})
