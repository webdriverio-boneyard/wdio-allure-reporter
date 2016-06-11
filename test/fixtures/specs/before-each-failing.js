'use strict'
const expect = require('chai').expect

describe('"before each" failing', () => {
    beforeEach(() => {
        expect(true).to.equal(false)
    })

    it('with passing test', () => {
        // test content doesn't matter
    })
})
