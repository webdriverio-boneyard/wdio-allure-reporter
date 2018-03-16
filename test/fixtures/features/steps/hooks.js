import { defineSupportCode } from 'cucumber'
import { expect } from 'chai'

defineSupportCode(({ After, Before }) => {
    Before(async () => {
        expect(true).to.be.equal(true)
    })

    Before(() => {
        expect(true).to.be.equal(true)
    })

    After(() => {
        expect(true).to.be.equal(true)
    })

    After(async () => {
        expect(true).to.be.equal(true)
    })
})
