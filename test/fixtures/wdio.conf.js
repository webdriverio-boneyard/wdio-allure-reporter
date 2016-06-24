var fs = require('fs')
var allureReporter = require('../../build/reporter')
allureReporter.reporterName = 'allure'

exports.config = {
    baseUrl: 'file:///' + fs.realpathSync(__dirname),
    coloredLogs: true,
    logLevel: 'silent',
    reporters: [allureReporter],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd'
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
