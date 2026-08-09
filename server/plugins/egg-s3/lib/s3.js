'use strict';

const assert = require('assert');
const {
  S3
} = require("@aws-sdk/client-s3");

module.exports = app => {
  app.addSingleton('s3', createClient);
};

function createClient(config, app) {
  const { accessKeyId, secretAccessKey } = config;

  assert(accessKeyId, `[egg-aws-s3] 'accessKeyId: ${accessKeyId}' is required on config`);
  assert(secretAccessKey, `[egg-aws-s3] 'secretAccessKey: ${secretAccessKey}' is required on config`);
  // assert(endpoint, `[egg-aws-s3] 'endpoint: ${endpoint}' is required on config`);

  // app.coreLogger.info('[egg-aws-s3] connecting %s', endpoint);
  const {region,...credentials} = config
  const params = {
    region,
    credentials
  };
  const s3 = new S3(params);
  app.beforeStart(async () => {
    // await s3.listBuckets();
    app.coreLogger.info('[egg-aws-s3] init instance success');
  });

  return s3;
}
