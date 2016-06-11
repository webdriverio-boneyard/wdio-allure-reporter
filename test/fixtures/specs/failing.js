'use strict'

describe('A failing Suite', () => {
    it('with failing test', () => {
        throw new Error('well known error')
    })
})
