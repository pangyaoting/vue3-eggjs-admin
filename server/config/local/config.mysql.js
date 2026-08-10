"use strict";

module.exports = {
  app: true,
  agent: false,
  clients: {
    "permission.master": {
      host: "localhost",
      port: "3306",
      user: "root",
      password: "root",
      database: "p11_permission",
      multipleStatements: true,
    },
    "permission.slave": {
      host: "localhost",
      port: "3306",
      user: "root",
      password: "root",
      database: "p11_permission",
      multipleStatements: true,
    },
  },
};
