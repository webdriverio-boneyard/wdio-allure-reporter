const expect = require('chai').expect
const helper = require('../helper')

describe('test cases', () => {
    beforeEach(helper.clean)

    it('should detect passed test case', () => {
        return helper.run(['passing']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A passing Suite')
            expect(result('test-case > name').text()).to.be.equal('with passing test')
            expect(result('test-case').attr('status')).to.be.equal('passed')
        })
    })

    it('should detect passed broken case', () => {
        return helper.run(['broken']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A broken Suite')
            expect(result('test-case > name').text()).to.be.equal('with broken test')
            expect(result('test-case').attr('status')).to.be.equal('broken')
        })
    })

    it('should detect passed failed case', () => {
        return helper.run(['failing']).then((results) => {
            expect(results).to.have.lengthOf(1)
            const result = results[0]

            expect(result('ns2\\:test-suite > name').text()).to.be.equal('A failing Suite')
            expect(result('test-case > name').text()).to.be.equal('with failing test')
            expect(result('test-case').attr('status')).to.be.equal('failed')
        })
    })
})
