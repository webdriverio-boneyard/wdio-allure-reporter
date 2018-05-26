var baseConfig = require('./wdio.conf.js').getConfig()

baseConfig.capabilities = {
    browser1: {
        desiredCapabilities: {
            browserName: 'chrome'
        }
    },
    browser2: {
        desiredCapabilities: {
            browserName: 'chrome'
        }
    }
}

exports.config = baseConfig
