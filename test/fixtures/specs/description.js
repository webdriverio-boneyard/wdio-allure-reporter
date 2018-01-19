'use strict'

const addDescription = require('./../../../build/runtime').addDescription

describe('Suite with description', () => {
    it('First case - default description type', () => {
        addDescription('Test description 1')
    })

    it('Second case - text description type', () => {
        addDescription('Test description 2', 'text')
    })

    it('Third case - html description type', () => {
        addDescription('Test description 3', 'html')
    })

    it('Fourth case - markdown description type', () => {
        addDescription('Test description 4', 'markdown')
    })
})
