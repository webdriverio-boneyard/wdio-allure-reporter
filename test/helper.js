'use strict'

let fs = require('fs')
let path = require('path')
let rimraf = require('rimraf')
let resultsDir = path.join(__dirname, '../allure-results')
let configFile = './test/fixtures/wdio.conf.js'
let Launcher = require('webdriverio/build/lib/launcher')
let parseXmlString = require('xml2js').parseString 

class helper {

  static getResultsXML () {
    let promises = helper.getResults().map((result) => {
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

  static getResults () {
    return fs.readdirSync(resultsDir)
      .filter((file) => file.endsWith('.xml'))
      .map((file) => {
        return fs.readFileSync(path.join(resultsDir, file))
      })
  }

  static clean () {
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

  static run (specs) {

    helper.disableOutput()
    specs = specs.map((spec) => './test/fixtures/specs/' + spec + '.js')

    let launcher = new Launcher(configFile, {
      specs: specs
    })

    let out = launcher.run()
    out.then(helper.enableOutput)

    return out

  }

  static disableOutput() {
    console.log = function() {}
    console.error = function() {}
  }
  static enableOutput() {
    console.log = console.orig_log
    console.error = console.orig_error
  }

}

console.orig_log = console.log
console.orig_error = console.error

module.exports = helper
