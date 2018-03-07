var baseConfig = require('./wdio.conf.js').getConfig()

baseConfig.capabilities = [{
    browserName: 'phantomjs'
}, {
    browserName: 'chrome'
}]

exports.config = baseConfig
