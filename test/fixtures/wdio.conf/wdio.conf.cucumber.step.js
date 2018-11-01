var baseConfig = require('./wdio.conf.js').getConfig()

baseConfig.framework = 'cucumber'
baseConfig.cucumberOpts = {
    timeout: 20000,
    require: ['test/fixtures/features/steps/passing-steps.js', 'test/fixtures/features/steps/hooks.js'],
    compiler: [
        'js:babel-register'
    ],
    failFast: true
}

baseConfig.reporterOptions.allure.useCucumberStepReporter = true

exports.config = baseConfig
