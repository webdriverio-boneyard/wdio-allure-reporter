import fs from 'fs'
import path from 'path'
import del from 'del'
import Launcher from 'webdriverio/build/lib/launcher'
import cheerio from 'cheerio'

const resultsDir = path.join(__dirname, '../.allure-results')

export function getResults () {
    return getResultFiles('xml').map((file) => {
        return cheerio.load(fs.readFileSync(path.join(resultsDir, file), 'utf-8'))
    })
}

export function getResultFiles (patterns) {
    if (!Array.isArray(patterns)) {
        patterns = [patterns]
    }
    return fs.readdirSync(resultsDir).filter((file) =>
        patterns.some(pattern => file.endsWith('.' + pattern)))
}

export function clean () {
    return del(resultsDir)
}

export function runMocha (specs, wdioConfigPath) {
    const features = specs.map(spec => `./test/fixtures/specs/${spec}.js`)
    const path = wdioConfigPath || './test/fixtures/wdio.conf/wdio.conf.mocha.js'

    return run(features, path)
}

export function runCucumber (specs) {
    const features = specs.map(feature => `./test/fixtures/features/${feature}.feature`)
    const wdioConfigPath = './test/fixtures/wdio.conf/wdio.conf.cucumber.js'

    return run(features, wdioConfigPath)
}

export function runJasmine (specs) {
    const features = specs.map(spec => `./test/fixtures/specs/${spec}.js`)
    const wdioConfigPath = './test/fixtures/wdio.conf/wdio.conf.jasmine.js'

    return run(features, wdioConfigPath)
}

function run (specs, wdioConfigPath) {
    disableOutput()
    const launcher = new Launcher(wdioConfigPath, {
        specs: specs
    })

    return launcher.run().then(() => {
        enableOutput()
        return getResults()
    })
}

let logs, originalConsole

function disableOutput () {
    if (process.env.FULL_OUTPUT) {
        return
    }
    const mockLog = (type) => (...message) => {
        logs[type].push(message.join(' '))
    }
    logs = {
        log: [],
        warn: [],
        error: []
    }
    originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error
    }
    console.log = mockLog('log')
    console.warn = mockLog('warn')
    console.error = mockLog('error')
}

function enableOutput () {
    if (process.env.FULL_OUTPUT) {
        return
    }
    console.log = originalConsole.log
    console.warn = originalConsole.warn
    console.error = originalConsole.error
}
