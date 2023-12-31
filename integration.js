'use strict';
const { map } = require('lodash/fp');

const { setLogger, getLogger } = require('./src/logger');
const { polarityRequest } = require('./src/polarity-request');
const { parseErrorToReadableJSON } = require('./src/errors');
const { PolarityResult } = require('./src/create-result-object');

let Logger = null;

const startup = (logger) => {
  Logger = logger;
  setLogger(Logger);
};
/**
 * @param entities
 * @param options
 * @param cb
 * @returns {Promise<void>}
 */

async function doLookup(entities, options, cb) {}

async function query() {}

function validateOptions(userOptions, cb) {}

module.exports = {
  startup,
  doLookup,
  onMessage,
  validateOptions
};
