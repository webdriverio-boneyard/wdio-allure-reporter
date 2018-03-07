var baseConfig = require('./wdio.conf.js').getConfig()

baseConfig.framework = 'mocha'
baseConfig.mochaOpts = {
    ui: 'bdd',
    timeout: 20000
}

exports.config = baseConfig
