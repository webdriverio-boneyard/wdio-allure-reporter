'use strict'

describe('A broken Suite', () => {
    it('with broken test', () => {
        throw new Error('unexpected error')
    })
})
