var allureReporter = require('../../build/reporter')
allureReporter.reporterName = 'allure'

exports.config = {
    baseUrl: 'http://localhost:8080',
    coloredLogs: true,
    logLevel: 'silent',
    services: ['phantomjs'],
    reporters: [allureReporter],
    framework: 'cucumber',
    cucumberOpts: {
        timeout: 20000,
        require: ['test/fixtures/features/steps/passing-steps.js'],
        compiler: [
            'js:babel-register'
        ]
    },
    reporterOptions: {
        allure: {
            outputDir: '.allure-results'
        }
    },
    sync: true,
    screenshotPath: './screenshots',
    capabilities: [{
        browserName: 'phantomjs'
    }]
}
