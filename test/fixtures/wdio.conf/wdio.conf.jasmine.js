var baseConfig = require('./wdio.conf.js').getConfig()

baseConfig.framework = 'jasmine'
baseConfig.jasmineNodeOpts = {
    defaultTimeoutInterval: 20000
}

exports.config = baseConfig
