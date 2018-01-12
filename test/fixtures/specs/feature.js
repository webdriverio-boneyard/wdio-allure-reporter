'use strict'

const feature = require('./../../../build/runtime').feature

describe('Suite with features', () => {
    it('First case', () => {
        feature('Test feature 1')
    })

    it('Second case', () => {
        feature('Test feature 2')
    })
})
