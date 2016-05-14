'use strict'

let fs = require('fs')
let path = require('path')

let specDir = path.join(__dirname, 'specs');

fs.readdirSync(specDir)
  .forEach(specFile => require(path.join(specDir, specFile)))
  
