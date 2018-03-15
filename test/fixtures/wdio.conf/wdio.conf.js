var allureReporter = require('../../../build/reporter')
allureReporter.reporterName = 'allure'

exports.getConfig = function () {
    return {
        baseUrl: 'http://localhost:54392',
        coloredLogs: true,
        logLevel: 'silent',
        services: ['phantomjs'],
        reporters: [allureReporter],
        framework: 'mocha',

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
}
