'use strict'

let fs = require('fs')
let path = require('path')
let expect = require('chai').expect
let rimraf = require('rimraf')
let Launcher = require('../node_modules/webdriverio/build/lib/launcher.js')
let parseXmlString = require('xml2js').parseString

let configFile = './test/fixtures/wdio.conf.js'
let resultsDir = path.join(__dirname, '../allure-results') 

describe('"before all" hook', () => {

  beforeEach(() => {
    clean()
  })

  it('should not show up in the results when it is passing', () => {

    return run(['before-all-passing']).then((code) => {

      return getResultsXML()
        .then((results) => {

          expect(results).to.have.lengthOf(1)
          expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(1)
          
          results[0]['ns2:test-suite']['test-cases'][0]['test-case']
            .forEach((testCase) => {

              switch(testCase.name[0]) {

                case '"before" hook':
                case '"before all" hook':
                case '"before each" hook':
                case '"after all" hook':
                case '"after each" hook':
                  throw new Error('\'' + testCase.name + '\' was not expected in the results when no hook fails')
                  break

              }

            })

        })
      
    })

  })

  it('should marked broken when failing', () => {

    return getResultsXML()
      .then((results) => {

        expect(results).to.have.lengthOf(1)
        expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(1)
        
        let isBeforeAllHookBroken = false

        results[0]['ns2:test-suite']['test-cases'][0]['test-case']
          .forEach((testCase) => {

            switch(testCase.name[0]) {

              case '"before" hook':
              case '"before each" hook':
              case '"after all" hook':
              case '"after each" hook':
                throw new Error('\'' + testCase.name + '\' was not expected in the results when no hook fails')
                break

              case '"before all" hook':
                isBeforeAllHookBroken = (testCase.$.status === 'broken')
                break;

            }

          })

        expect(isBeforeAllHookBroken).to.be.true

      })

  })

  it('should marked broken when failing async', () => {

    return getResultsXML()
      .then((results) => {

        expect(results).to.have.lengthOf(1)
        expect(results[0]['ns2:test-suite']['test-cases']).to.have.lengthOf(1)
        
        let isBeforeAllHookBroken = false

        results[0]['ns2:test-suite']['test-cases'][0]['test-case']
          .forEach((testCase) => {

            switch(testCase.name[0]) {

              case '"before" hook':
              case '"before each" hook':
              case '"after all" hook':
              case '"after each" hook':
                throw new Error('\'' + testCase.name + '\' was not expected in the results when no hook fails')
                break

              case '"before all" hook':
                isBeforeAllHookBroken = (testCase.$.status === 'broken')
                break;

            }

          })

        expect(isBeforeAllHookBroken).to.be.true

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

function clean(done) {
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

  return launcher.run()
    .then(enableOutput)

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
