'use strict'

const reporter = require('./../../../build/reporter')

describe('Suite with features', () => {
    it('First case', () => {
        reporter.feature('Test feature 1')
    })

    it('Second case', () => {
        reporter.feature('Test feature 2')
    })
})
