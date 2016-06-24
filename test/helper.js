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

export function run (specs) {
    const launcher = new Launcher('./test/fixtures/wdio.conf.js', {
        specs: specs.map(spec => `./test/fixtures/specs/${spec}.js`)
    })

    return launcher.run().then(() => {
        return getResults()
    })
}
