import { expect } from 'chai'
import { clean, run } from '../helper'

describe('Suites', () => {
    beforeEach(clean)

    it('should report two suites from one file', () => {
        return run(['two-passing-in-one-suite']).then((results) => {
            expect(results).to.have.lengthOf(2)
            results.forEach(result => {
                expect(result('ns2\\:test-suite > name').text())
                    .to.match(/(First|Second) passing Suite/)
                expect(result('test-case')).to.have.lengthOf(1)
                expect(result('test-case').attr('status')).to.equal('passed')
            })
        })
    })

    it('should split nested suites', () => {
        return run(['nested-suite']).then(results => {
            expect(results).to.have.lengthOf(2)

            const suiteNames = results.map(result => result('ns2\\:test-suite > name').text())
            expect(suiteNames).to.include('A top-level Suite Nested Suite')
            expect(suiteNames).to.include('A top-level Suite Nested Suite in another nested Suite')

            const caseNames = results.map(result => result('test-case > name').text())
            expect(caseNames).to.include('with passing test')
            expect(caseNames).to.include('also with passing test')
        })
    })
})
