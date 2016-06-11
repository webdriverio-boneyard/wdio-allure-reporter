'use strict'
const expect = require('chai').expect
const helper = require('../helper')

describe('Suites', () => {
    beforeEach(helper.clean)

    it('get their title from the top level describe block', () => {
        return helper.run(['passing']).then((code) => {
            expect(code, 'wrong exit status code').to.be.equal(0)
            return helper.getResultsXML()
        }).then((results) => {
            expect(results).to.have.lengthOf(1)

            expect(results[0]['ns2:test-suite']['name']).to.have.lengthOf(1)
            expect(results[0]['ns2:test-suite']['name'][0]).to.be.equal('A passing Suite')
        })
    })

    describe('with each a passing test', () => {
        let results

        before(() => {
            return helper.run(['two-passing-in-one-suite']).then((code) => {
                expect(code, 'wrong exit status code').to.be.equal(0)
                return helper.getResultsXML()
            }).then((res) => {
                results = res
            })
        })

        it('match with the number of top level describe blocks', () => {
            expect(results).to.have.lengthOf(2)
        })

        it('includes the title of both describe blocks', function () {
            try {
                expect(results).to.have.lengthOf(2)
            } catch (e) {
                this.skip()
            }

            let resultSuiteTitles = results.map((row) => {
                return row['ns2:test-suite']['name'][0]
            })

            expect(resultSuiteTitles).to.contain('First passing Suite')
            expect(resultSuiteTitles).to.contain('Second passing Suite')
        })

        it('has the right test cases in each suite', function () {
            try {
                expect(results).to.have.lengthOf(2)

                let resultSuiteTitles = results.map((row) => {
                    return row['ns2:test-suite']['name'][0]
                })

                expect(resultSuiteTitles).to.contain('First passing Suite')
                expect(resultSuiteTitles).to.contain('Second passing Suite')
            } catch (e) {
                this.skip()
            }

            results.forEach((row) => {
                expect(row['ns2:test-suite']['test-cases']).to.have.lengthOf(1)
                expect(row['ns2:test-suite']['test-cases'][0]['test-case']).to.have.lengthOf(1)

                switch (row['ns2:test-suite']['name'][0]) {

                case 'First passing Suite':
                    expect(row['ns2:test-suite']['test-cases'][0]['test-case'][0]['$']['status']).to.be.equal('passed')
                    expect(row['ns2:test-suite']['test-cases'][0]['test-case'][0]['name'][0]).to.be.equal('with passing test in the first Suite')
                    break

                case 'Second passing Suite':
                    expect(row['ns2:test-suite']['test-cases'][0]['test-case'][0]['name'][0]).to.be.equal('with passing test in the second Suite')
                    expect(row['ns2:test-suite']['test-cases'][0]['test-case'][0]['$']['status']).to.be.equal('passed')
                    break

                }
            })
        })
    })

    describe('can be nested, so that', () => {
        let results

        before(() => {
            return helper.run(['nested-suite']).then((code) => {
                expect(code, 'wrong exit status code').to.be.equal(0)
                return helper.getResultsXML()
            }).then((res) => {
                results = res
            })
        })

        it('all suite and case titles (except the top-level one) get concatenated to the Allure case name', () => {
            let delimiter = ' >> '
            expect(results).to.have.lengthOf(1)

            let testCaseNames = results[0]['ns2:test-suite']['test-cases'].map((testCase) => {
                return testCase['test-case'][0]['name'][0]
            })

            expect(results[0]['ns2:test-suite']['name'][0]).to.be.equal('A top-level Suite')

            expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(2)
            expect(testCaseNames).to.contain(['Nested Suite', 'with passing test'].join(delimiter))
            expect(testCaseNames).to.contain(['Nested Suite', 'in another nested Suite', 'also with a passing test'].join(delimiter))
        })
    })
})
