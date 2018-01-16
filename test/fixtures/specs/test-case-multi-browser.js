'use strict'
const feature = require('./../../../build/runtime').feature

describe('A passing Suite', () => {
    it('with passing test', () => {
        feature(browser.desiredCapabilities.browserName)
    })
})
