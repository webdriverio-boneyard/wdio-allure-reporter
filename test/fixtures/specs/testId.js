'use strict'

const reporter = require('./../../../build/reporter')

describe('Suite with testIds', () => {
    console.log('Running suite')
    it('Test #1', () => {
        reporter.testId('3')
    })

    it('Test #2', () => {
        reporter.testId('4')
    })
})
