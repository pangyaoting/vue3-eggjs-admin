# egg-s3

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-s3.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-s3
[travis-image]: https://img.shields.io/travis/eggjs/egg-s3.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-s3
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-s3.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-s3?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-s3.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-s3
[snyk-image]: https://snyk.io/test/npm/egg-s3/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-s3
[download-image]: https://img.shields.io/npm/dm/egg-s3.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-s3

<!--
Description here.
-->

## Install

```bash
$ npm i egg-s3 --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.s3 = {
  enable: true,
  package: 'egg-s3',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.s3 = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
