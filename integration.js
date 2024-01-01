'use strict';

const { setLogger, getLogger } = require('./src/logger');
const { parseErrorToReadableJSON } = require('./src/errors');

const { polarityRequest } = require('./src/polarity-request');

let Logger = null;

const startup = (logger) => {
  Logger = logger;
  setLogger(Logger);
};

async function doLookup(entities, options, cb) {
  const Logger = getLogger();

  polarityRequest.setOptions(options);

  polarityRequest.setHeader('content-type', 'application/json');
  polarityRequest.setHeader('accept', 'application/json');

  const token = await getAccessToken();

  polarityRequest.setHeader('authorization', `Bearer ${token}`);
}

async function searchEntities(entities) {
  const Logger = getLogger();

  const searchResults = await Promise.all(entities.map(async (entity) => {}));

  return searchResults;
}

async function getAccessToken() {
  const response = await polarityRequest.send({
    method: 'POST',
    url: 'https://auth.app.wiz.io/oauth/token',
    form: {
      grant_type: 'client_credentials',
      client_id: polarityRequest.options.clientId,
      client_secret: polarityRequest.options.clientSecret,
      audience: 'wiz-api'
    }
  });

  Logger.trace({ token_response: response });

  const accessToken = response[0].result.body.access_token;

  return accessToken;
}

module.exports = {
  startup,
  doLookup
};
