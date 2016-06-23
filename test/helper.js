'use strict'

const fs = require('fs')
const path = require('path')
const del = require('del')
const resultsDir = path.join(__dirname, '../.allure-results')
const Launcher = require('webdriverio/build/lib/launcher')
const cheerio = require('cheerio')

class Helper {

    static getResults () {
        return Helper.getResultFiles('xml').map((file) => {
            return cheerio.load(fs.readFileSync(path.join(resultsDir, file), 'utf-8'))
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

    static run (specs) {
        Helper.disableOutput()

        const launcher = new Launcher('./test/fixtures/wdio.conf.js', {
            specs: specs.map(spec => `./test/fixtures/specs/${spec}.js`)
        })

        return launcher.run().then(result => {
            Helper.enableOutput()
            return Helper.getResults()
        })
    }

    static disableOutput () {
        if (process.env.FULL_OUTPUT) {
            return
        }
        const mockLog = (type) => (...message) => {
            this.logs[type].push(message.join(' '))
        }
        this.logs = {
            log: [],
            warn: [],
            error: []
        }
        this.originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error
        }
        console.log = mockLog('log')
        console.warn = mockLog('warn')
        console.error = mockLog('error')
    }

    static enableOutput () {
        if (process.env.FULL_OUTPUT) {
            return
        }
        console.log = this.originalConsole.log
        console.warn = this.originalConsole.warn
        console.error = this.originalConsole.error
    }
}

module.exports = Helper
