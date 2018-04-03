import {Before, After} from 'cucumber'
import {expect} from 'chai'

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
