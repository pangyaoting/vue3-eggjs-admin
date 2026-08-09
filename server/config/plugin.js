'use strict'
const path = require('path')
/** @type Egg.EggPlugin */
module.exports = {
  routerPlus: {
    enable: true,
    package: 'egg-router-plus'
  },
  validate: {
    enable: true,
    package: 'egg-validate'
  },
  s3: {
    enable: true,
    path: path.join(__dirname, '../plugins/egg-s3')
  }
}
