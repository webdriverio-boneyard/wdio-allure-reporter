'use strict'
const expect = require('chai').expect

describe('A pending Suite', () => {
    xit('pending test', () => {
        expect(1).to.equal(1)
    })

    it('test without function')
})
