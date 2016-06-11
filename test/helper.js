'use strict'

const fs = require('fs')
const path = require('path')
const del = require('del')
const resultsDir = path.join(__dirname, '../allure-results')
const Launcher = require('webdriverio/build/lib/launcher')
const denodeify = require('denodeify')
const parseXmlString = denodeify(require('xml2js').parseString)

class Helper {

    static getResultsXML () {
        return Promise.all(
            Helper.getResults().map((result) => parseXmlString(result, { trim: true }))
        )
    }

    static getResults () {
        return Helper.getResultFiles('xml').map((file) => {
            return fs.readFileSync(path.join(resultsDir, file))
        })
    }

    static getResultFiles (patterns) {
        if (!Array.isArray(patterns)) {
            patterns = [patterns]
        }
        return fs.readdirSync(resultsDir).filter((file) =>
            patterns.some(pattern => file.endsWith('.' + pattern)))
    }

    static clean () {
        return del(resultsDir)
    }

    static run (specs, configName) {
        Helper.disableOutput()

        const launcher = new Launcher(
            `./test/fixtures/wdio-${configName || 'default'}.conf.js`,
            {
                specs: specs.map(spec => `./test/fixtures/specs/${spec}.js`)
            }
        )

        return launcher.run().then(result => {
            Helper.enableOutput()
            return result
        })
    }

    static disableOutput () {
        console.log = function () {}
        console.error = function () {}
    }

    static enableOutput () {
        console.log = console.orig_log
        console.error = console.orig_error
    }
}

console.orig_log = console.log
console.orig_error = console.error

module.exports = Helper
