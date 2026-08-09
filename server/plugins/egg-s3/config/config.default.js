'use strict';

/**
 * egg-s3 default config
 * @member Config#s3
 */
exports.s3 = {
  // default configuration for all clients
  default: {
    // endpoint: 'http://www.google.com',
    // s3ForcePathStyle: '',
    // maxRetries: '',
    // sslEnabled: '',
    // apiVersion: '',
    // signatureVersion: '',
    // ...
  },
  app: true,
  agent: false,

  // Single client
  // client: {
  //   accessKeyId: '',
  //   secretAccessKey: '',
  //   endpoint: '',
  //   // ...
  // },

  // Multi client
  // clients: {
  //   client1: {
  //     accessKeyId: '',
  //     secretAccessKey: '',
  //     endpoint: '',
  //     // ...
  //   },
  //   client2: {
  //     accessKeyId: '',
  //     secretAccessKey: '',
  //     endpoint: '',
  //     // ...
  //   },
  // },
};
