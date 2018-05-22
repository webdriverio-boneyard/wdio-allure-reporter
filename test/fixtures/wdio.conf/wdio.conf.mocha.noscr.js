var baseConfig = require('./wdio.conf.js').getConfig()

baseConfig.framework = 'mocha'
baseConfig.mochaOpts = {
    ui: 'bdd',
    timeout: 20000
}
baseConfig.reporterOptions.allure.disableWebdriverScreenshotsReporting = true

exports.config = baseConfig
