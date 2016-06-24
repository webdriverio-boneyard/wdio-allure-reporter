var allureReporter = require('../../build/reporter')
allureReporter.reporterName = 'allure'

exports.config = {
    baseUrl: 'http://localhost:8080',
    coloredLogs: true,
    logLevel: 'silent',
    reporters: [allureReporter],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 20000
    },
    reporterOptions: {
        allure: {
            outputDir: '.allure-results'
        }
    },
    sync: false,
    screenshotPath: './screenshots',
    capabilities: [{
        browserName: 'phantomjs'
    }]
}
