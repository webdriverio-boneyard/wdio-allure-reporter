var fs = require('fs')
var allureReporter = require('../../build/reporter')
var argv = require('minimist')(process.argv.slice(2))

allureReporter.reporterName = function(){
  return "allure"
}

exports.config = {
  baseUrl: 'file:///' + fs.realpathSync(__dirname),
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
  }],
  screenshotPath: './screenshots'
}
