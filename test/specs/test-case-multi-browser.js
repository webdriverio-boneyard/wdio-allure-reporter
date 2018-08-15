import { expect } from 'chai'
import { clean, runMocha } from '../helper'

describe('Multi-browser test case', () => {
    beforeEach(clean)

    it('should detect different browsers parameter for same test case', () => {
        return runMocha(['test-case-multi-browser'], './test/fixtures/wdio.conf/wdio-multi-browser.conf.js').then((results) => {
            expect(results).to.have.lengthOf(2)
            const result1 = results[0]
            const result2 = results[1]

            expect(result1('ns2\\:test-suite > name').text()).to.be.equal('A passing Suite')
            expect(result1('test-case > name').text()).to.be.equal('with passing test')
            expect(result1('test-case').attr('status')).to.be.equal('passed')
            expect(result1('test-case parameter[kind="environment-variable"]')).to.have.lengthOf(2)
            expect(result1('test-case parameter[kind="environment-variable"]').eq(0).attr('name')).to.be.equal('capabilities')
            expect(result1('test-case parameter[kind="environment-variable"]').eq(1).attr('name')).to.be.equal('spec files')
            expect(result1('test-case parameter[kind="environment-variable"]').eq(1).attr('value')).to.be.contains('test-case-multi-browser.js')

            expect(result2('ns2\\:test-suite > name').text()).to.be.equal('A passing Suite')
            expect(result2('test-case > name').text()).to.be.equal('with passing test')
            expect(result2('test-case').attr('status')).to.be.equal('passed')
            expect(result2('test-case parameter[kind="environment-variable"]')).to.have.lengthOf(2)
            expect(result2('test-case parameter[kind="environment-variable"]').eq(0).attr('name')).to.be.equal('capabilities')
            expect(result2('test-case parameter[kind="environment-variable"]').eq(1).attr('name')).to.be.equal('spec files')
            expect(result2('test-case parameter[kind="environment-variable"]').eq(1).attr('value')).to.be.contains('test-case-multi-browser.js')

            const browserName1 = result1('test-case parameter[name="capabilities"]').eq(0).attr('value')
            const browserName2 = result2('test-case parameter[name="capabilities"]').eq(0).attr('value')

            expect([browserName1, browserName2]).to.have.members(['{"browserName":"phantomjs","version":"42"}', '{"browserName":"chrome","version":"65"}'])
        })
    })

    it('should add browser name to argument', () => {
        return runMocha(['test-case-multi-browser'], './test/fixtures/wdio.conf/wdio-multi-browser.conf.js').then((results) => {
            expect(results).to.have.lengthOf(2)
            const result1 = results[0]
            const result2 = results[1]
            const browserName1 = result1('test-case parameter[name="browser"]').attr('value')
            const browserName2 = result2('test-case parameter[name="browser"]').attr('value')
            expect([browserName1, browserName2]).to.have.members(['phantomjs-42', 'chrome-65'])
        })
    })
})
