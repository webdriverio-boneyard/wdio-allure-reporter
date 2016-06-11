'use strict'
const expect = require('chai').expect

describe('A failing Suite', () => {
    it('with failing test', () => {
        expect(false).to.equal(true)
    })
})
