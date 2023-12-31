const fs = require('fs');
const request = require('postman-request');
const { getLogger } = require('./logger');
const { NetworkError, ApiRequestError, AuthRequestError } = require('./errors');
const {
  request: { ca, cert, key, passphrase, rejectUnauthorized, proxy }
} = require('../config/config.js');
const { map } = require('lodash/fp');
const { parallelLimit } = require('async');
const { log } = require('console');

const _configFieldIsValid = (field) => typeof field === 'string' && field.length > 0;

const defaults = {
  ...(_configFieldIsValid(ca) && { ca: fs.readFileSync(ca) }),
  ...(_configFieldIsValid(cert) && { cert: fs.readFileSync(cert) }),
  ...(_configFieldIsValid(key) && { key: fs.readFileSync }),
  ...(_configFieldIsValid(passphrase) && { passphrase }),
  ...(_configFieldIsValid(proxy) && { proxy }),
  ...(typeof rejectUnauthorized === 'boolean' && { rejectUnauthorized }),
  json: true
};

const HTTP_CODE_SUCCESS_200 = 200;
const HTTP_CODE_SUCCESS_201 = 201;
const HTTP_CODE_SUCCESS_202 = 202;

const HTTP_CODE_BAD_REQUEST_400 = 400;
const HTTP_CODE_EXPIRED_BEARER_TOKEN_401 = 401;
const HTTP_CODE_TOKEN_MISSING_PERMISSIONS_OR_REVOKED_403 = 403;
const HTTP_CODE_NOT_FOUND_404 = 404;
const HTTP_CODE_API_LIMIT_REACHED_429 = 429;

const HTTP_CODE_SERVER_LIMIT_500 = 500;
const HTTP_CODE_SERVER_LIMIT_502 = 502;
const HTTP_CODE_SERVER_LIMIT_504 = 504;

class PolarityRequest {
  constructor() {
    this.requestWithDefaults = request.defaults(defaults);
    this.headers = {};
    this.options = {};
    this.MAX_RETRIES = 0;
    this.currentRetries = 0;
  }
  /**
   * Set header `field` to `val`, or pass
   * an object of header fields.
   *
   * Examples:
   *    res.set('Foo', ['bar', 'baz']);
   *    res.set('Accept', 'application/json');
   *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
   * @param {String|Object} field
   * @param {String|Array} val
   * @public
   */
  setHeader(field, value) {
    const Logger = getLogger();
    // need to add mime type to the request in a generic way
    if (arguments.length === 2) {
      this.headers[field] = value;
    } else {
      for (let key in field) {
        Logger.trace({ key, field: field[key] }, 'Setting Header');
        this.headers[key] = field[key];
      }
    }
  }

  setOptions(options) {
    this.options = options;
  }
  /**
   * Makes a request network request using postman-request.  If the request is an array, it will run the requests in parallel.
   * @param requestOptions  - the request options to pass to postman-request. It will either being an array of requests or a single request.
   * @returns {{Promise<*>} || {Promise<Array<*>>}}- returns a promise that resolves to the response from the request
   */
  async request(reqOpts) {
    const Logger = getLogger();

    const requestOptionsObj = {
      method: reqOpts.method,
      url: this.options.url + reqOpts.path,
      headers: this.headers,
      ...reqOpts
    };

    const { path, ...requestOptions } = requestOptionsObj;
    Logger.trace({ requestOptions }, 'Request Options');

    return new Promise((resolve, reject) => {
      this.requestWithDefaults(requestOptions, async (err, response) => {
        Logger.trace({ err, response }, 'Request Response');
        const statusCode = response.statusCode;

        if (
          statusCode === HTTP_CODE_SUCCESS_200 ||
          statusCode === HTTP_CODE_SUCCESS_201 ||
          statusCode === HTTP_CODE_SUCCESS_202
        ) {
          return resolve({ ...response, requestOptions });
        }

        /*
          The MXToolBox API will return a 400 if the API key has gone over the daily rate limit. 
          example of message from API: Over Daily Simple API Limit - 64, ApiKey: *************. Documentation available at https://mxtoolbox.com/restapi.aspx
         */
        if (statusCode === HTTP_CODE_BAD_REQUEST_400) {
          const message = response.body.substring(0, response.body.indexOf(' - '));

          if (message === 'Over Daily API Limit') {
            return reject(
              new ApiRequestError(
                `Request Error: Check that your API key has not gone over the daily rate limit.`
              )
            );
          }

          return reject(
            new ApiRequestError(
              `Request Error: Or, check that the MXtoolbox URL is correct in the Polarity client user options.
                `,
              {
                statusCode,
                requestOptions
              }
            )
          );
        }

        if (statusCode === HTTP_CODE_EXPIRED_BEARER_TOKEN_401) {
          return reject(
            new AuthRequestError(
              `Authorization Error: Check that your API key is valid.`,
              {
                statusCode,
                requestOptions
              }
            )
          );
        }

        if (statusCode === HTTP_CODE_TOKEN_MISSING_PERMISSIONS_OR_REVOKED_403) {
          return reject(
            new AuthRequestError(
              `Token Error: Check that your API key is not expired and that you have the correct permissions.`
            )
          );
        }
        if (statusCode === HTTP_CODE_NOT_FOUND_404) {
          return resolve({ ...response, requestOptions });
        }

        if (statusCode === HTTP_CODE_API_LIMIT_REACHED_429) {
          return reject(
            new ApiRequestError(``, {
              statusCode,
              requestOptions
            })
          );
        }

        //TODO: add retry logic for 500, 502, 504s
        if (
          statusCode === HTTP_CODE_SERVER_LIMIT_500 ||
          statusCode === HTTP_CODE_SERVER_LIMIT_502 ||
          statusCode === HTTP_CODE_SERVER_LIMIT_504
        ) {
          return reject(
            new NetworkError(
              `Network Error: The server you are trying to connect to is unavailable`,
              {
                cause: err,
                requestOptions
              }
            )
          );
        }
      });
    });
  }

  async runRequestsInParallel(requestOptions, limit = 10) {
    if (!Array.isArray(requestOptions)) {
      requestOptions = [requestOptions];
    }

    const unexecutedRequestFunctions = map(
      ({ entity, ...singleRequestOptions }) =>
        async () => {
          const result = await this.request(singleRequestOptions);
          return result ? { entity, result } : result;
        },
      requestOptions
    );

    return await parallelLimit(unexecutedRequestFunctions, limit);
  }

  async send(requestOptions) {
    const Logger = getLogger();
    Logger.trace({ requestOptions }, 'Request Options (before request)');
    return await this.runRequestsInParallel(requestOptions);
  }
}

module.exports = {
  polarityRequest: new PolarityRequest()
};
