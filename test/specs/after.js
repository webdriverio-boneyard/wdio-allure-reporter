'use strict'

let expect = require('chai').expect
let helper = require('../helper')

describe('"after all" hook', () => {
    beforeEach(helper.clean)

    it('should not show up in the results when it is passing', () => {
        return helper.run(['after-all-passing']).then((code) => {
            expect(code, 'wrong exit status code').to.equal(0)
            return helper.getResultsXML()
        }).then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(1)

            const hookNames = ['before', 'before all', 'before each', 'after all', 'after each']
            .map(hookName => '"' + hookName + '" hook')

            const hookErrors = results[0]['ns2:test-suite']['test-cases'][0]['test-case']
            .filter(testCase => hookNames.indexOf(testCase.name[0]) > -1)

            expect(hookErrors, 'there should not be any hooks').to.be.empty
        })
    })

    it('should marked broken when failing', () => {
        return helper.run(['after-all-failing']).then((code) => {
            expect(code, 'wrong exit status code').to.be.at.least(1)
            return helper.getResultsXML()
        }).then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(1)

            // after all is the only hook in the results
            const hookNames = ['before', 'before each', 'before all', 'after each']
            .map(hookName => '"' + hookName + '" hook')

            const hookErrors = results[0]['ns2:test-suite']['test-cases'][0]['test-case']
            .filter(testCase => hookNames.indexOf(testCase.name[0]) > -1)

            expect(hookErrors, 'there should only be the "after all" hook').to.be.empty

            // after-all is marked broken
            const beforeAllHook = results[0]['ns2:test-suite']['test-cases'][0]['test-case']
            .filter(testCase => (testCase.name[0] === '"after all" hook'))[0]

            expect(beforeAllHook, '"after all" hook should be broken').to.have.deep.property('$.status', 'broken')
        })
    })

    it('should marked broken when failing async', () => {
        return helper.run(['after-all-failing-async']).then((code) => {
            expect(code, 'wrong exit status code').to.be.at.least(1)
            return helper.getResultsXML()
        }).then((results) => {
            expect(results).to.have.lengthOf(1)
            expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(1)

            // after all is the only hook in the results
            const hookNames = ['before', 'before each', 'before all', 'after each']
            .map(hookName => '"' + hookName + '" hook')

            const hookErrors = results[0]['ns2:test-suite']['test-cases'][0]['test-case']
            .filter(testCase => hookNames.indexOf(testCase.name[0]) > -1)
            expect(hookErrors, 'there should only be the "after all" hook').to.be.empty

            // after-all is marked broken
            const beforeAllHook = results[0]['ns2:test-suite']['test-cases'][0]['test-case']
            .filter(testCase => (testCase.name[0] === '"after all" hook'))[0]

            expect(beforeAllHook, '"after all" hook should be broken').to.have.deep.property('$.status', 'broken')
        })
    })
})
