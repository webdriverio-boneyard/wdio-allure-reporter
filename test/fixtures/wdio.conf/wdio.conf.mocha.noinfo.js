var baseConfig = require('./wdio.conf.js').getConfig()

baseConfig.framework = 'mocha'
baseConfig.mochaOpts = {
    ui: 'bdd',
    timeout: 20000
}
baseConfig.reporterOptions.allure.disableWebdriverStepsReporting = true
baseConfig.reporterOptions.allure.disableWebdriverScreenshotsReporting = true

exports.config = baseConfig
