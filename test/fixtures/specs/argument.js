'use strict'

const reporter = require('./../../../build/reporter')

describe('Suite with custom argument', () => {
    console.log('Running suite')
    it('Test #1', () => {
        reporter.addArgument('os', 'osx')
    })

    it('Test #1', () => {
        reporter.addArgument('os', 'windows')
    })
})
