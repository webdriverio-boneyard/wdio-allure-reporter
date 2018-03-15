'use strict'
const reporter = require('./../../../build/reporter')

describe('A passing Suite', () => {
    it('with passing test', () => {
        reporter.feature(browser.desiredCapabilities.browserName)
        return browser.url('/index.html')
    })
})
