'use strict'

describe('A passing Suite', () => {
    it('with passing test', () => {
        return browser
            .url('/index.html')
            .pause(3000)
    })
})
