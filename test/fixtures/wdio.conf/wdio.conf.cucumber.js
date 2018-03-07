var baseConfig = require('./wdio.conf.js').getConfig()

baseConfig.framework = 'cucumber'
baseConfig.cucumberOpts = {
    timeout: 20000,
    require: ['test/fixtures/features/steps/passing-steps.js'],
    compiler: [
        'js:babel-register'
    ]
}

exports.config = baseConfig
