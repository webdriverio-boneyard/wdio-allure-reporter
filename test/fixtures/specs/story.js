'use strict'

const reporter = require('./../../../build/reporter')

describe('Suite with stories', () => {
    it('Test #1', () => {
        reporter.story('Story label for Test #1')
    })

    it('Test #2', () => {
        reporter.story('Story label for Test #2')
    })
})
