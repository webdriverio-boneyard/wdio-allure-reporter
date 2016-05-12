'use strict'

let fs = require('fs')
let path = require('path')
let expect = require('chai').expect
let rimraf = require('rimraf')
let Launcher = require('webdriverio/build/lib/launcher')
let parseXmlString = require('xml2js').parseString

let configFile = './test/fixtures/wdio.conf.js'
let resultsDir = path.join(__dirname, '../allure-results') 

describe('"before all" hook', () => {

  beforeEach(clean)

  it('should not show up in the results when it is passing', () => {

    return run(['before-all-passing']).then((code) => {

      expect(code, 'wrong exit status code').to.equal(0)
      return getResultsXML();
      
    })
    .then((results) => {

      expect(results).to.have.lengthOf(1)
      expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(1)
      
      const hookNames = ['before', 'before all', 'before each', 'after all', 'after each'].map(hookName => '"' + hookName + '" hook');
      const hookErrors = results[0]['ns2:test-suite']['test-cases'][0]['test-case'].filter(testCase => hookNames.indexOf(testCase.name[0]) > -1)
      expect(hookErrors, 'there should not be any hooks').to.be.empty

    })

  })

  it('should marked broken when failing', () => {

    return run(['before-all-failing']).then((code) => {

      expect(code, 'wrong exit status code').to.be.at.least(1)
      return getResultsXML();

    })
    .then((results) => {

      expect(results).to.have.lengthOf(1)
      expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(1)
      
      const hookNames = ['before', 'before each', 'after all', 'after each'].map(hookName => '"' + hookName + '" hook')

      const hookErrors = results[0]['ns2:test-suite']['test-cases'][0]['test-case'].filter(testCase => hookNames.indexOf(testCase.name[0]) > -1)
      expect(hookErrors, 'there should only be the "before all" hook').to.be.empty

      const beforeAllHook = results[0]['ns2:test-suite']['test-cases'][0]['test-case'].filter(testCase => hookNames.indexOf(testCase.name[0]) === -1)[0]
      expect(beforeAllHook, '"before all" hook should be broken').to.have.deep.property('$.status', 'broken')

    })

  })

  it('should marked broken when failing async', () => {

    return run(['before-all-failing-async']).then((code) => {

      expect(code, 'wrong exit status code').to.be.at.least(1)
      return getResultsXML()

    })
    .then((results) => {

      expect(results).to.have.lengthOf(1)
      expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(1)
          
      const hookNames = ['before', 'before each', 'after all', 'after each'].map(hookName => '"' + hookName + '" hook')

      const hookErrors = results[0]['ns2:test-suite']['test-cases'][0]['test-case'].filter(testCase => hookNames.indexOf(testCase.name[0]) > -1)
      expect(hookErrors, 'there should only be the "before all" hook').to.be.empty

      const beforeAllHook = results[0]['ns2:test-suite']['test-cases'][0]['test-case'].filter(testCase => hookNames.indexOf(testCase.name[0]) === -1)[0]
      expect(beforeAllHook, '"before all" hook should be broken').to.have.deep.property('$.status', 'broken')

    })

  })

})

function getResultsXML() {
  let promises = getResults().map((result) => {
    return new Promise((resolve, reject) => {
      parseXmlString(result, { trim: true }, (err, xmlData) => {
        if(err) {
          reject(err)
        } else {
          resolve(xmlData);
        }
      })
    })
  })

  return Promise.all(promises)
}

function getResults() {
  return fs.readdirSync(resultsDir)
    .filter((file) => file.endsWith('.xml'))
    .map((file) => {
      return fs.readFileSync(path.join(resultsDir, file))
    })
}

function clean() {
  return new Promise((resolve, reject) => {
    rimraf(resultsDir, (err) => {
      if(err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function run(specs) {

  disableOutput()
  specs = specs.map((spec) => './test/fixtures/specs/' + spec + '.js')

  let launcher = new Launcher(configFile, {
    specs: specs
  })

  let out = launcher.run()
  out.then(enableOutput)

  return out

}

console.orig_log = console.log
console.orig_error = console.error
function disableOutput() {
  console.log = function() {}
  console.error = function() {}
}
function enableOutput() {
  console.log = console.orig_log
  console.error = console.orig_error
}
