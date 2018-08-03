const expect = require('chai').expect

describe('A pending Suite', () => {
    it.skip('1. this is a skipped test without any code', function () {
    })

    it.skip('2. this is another skipped test without any code', function () {
    })

    it('3. this is an enabled test that has a successfull assert', function () {
        expect('foo', 'foo should equal foo').to.contain('foo')
    })

    it('4. this is an enabled test that has a failed assert', function () {
        expect('foo', 'foo should equal foo').to.contain('foo2')
    })
})
