var path = require('path')
var allureReporter = require('../../build/reporter')
var argv = require('minimist')(process.argv.slice(2))

allureReporter.reporterName = function(){
  return "allure"
}

exports.config = {
  baseUrl: 'http://127.0.0.1:' + (process.env.PORT || 8090),
  coloredLogs: true,
  logLevel: 'silent',
  reporters: [allureReporter],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd'
  },
  sync: false,
  capabilities: [{
    browserName: 'chrome'
  }]
}
