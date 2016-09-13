'use strict'
const expect = require('chai').expect

describe('A pending Suite', () => {
    it('with passing test', () => {
      expect(1).to.equal(1)
    })

    it('with pending test')
})
