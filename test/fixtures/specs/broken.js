'use strict'

describe('A broken Suite', () => {
    it('with broken test', () => {
        return browser
            .url('/index.html')
            .missingCommand()
    })
})
