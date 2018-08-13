var baseConfig = require('./wdio.conf.js').getConfig()

baseConfig.capabilities = [{
    browserName: 'phantomjs',
    version: '42'
}, {
    browserName: 'chrome',
    version: '65'
}]

exports.config = baseConfig
