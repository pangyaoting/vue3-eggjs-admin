'use strict';

const s3 = require('./lib/s3');

module.exports = app => {
  if (app.config.s3.app) s3(app);
};
