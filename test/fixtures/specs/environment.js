'use strict'

const reporter = require('./../../../build/reporter')

describe('Suite with environments', () => {
    it('First case', () => {
        reporter.addEnvironment('ENVIRONMENT', 'TEST')
    })

    it('Second case', () => {
        reporter.addEnvironment('ENVIRONMENT', 'Firefox')
    })
})
