'use strict'
const expect = require('chai').expect

describe('A failing Suite', () => {
    it('with failing test', () => {
        return browser
            .url('/index.html')
            .waitForExist('#clickable')
            .then(() => {
                expect(true).to.be.equal(false)
            })
    })
})
