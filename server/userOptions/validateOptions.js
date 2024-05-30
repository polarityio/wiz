const { validateStringOptions } = require('./utils');

const validateOptions = async (options, callback) => {
  const stringOptionsErrorMessages = {
    authTokenDomain: '* Required',
    clientId: '* Required',
    clientSecret: '* Required'
  };

  const stringValidationErrors = validateStringOptions(
    stringOptionsErrorMessages,
    options
  );

  if (stringValidationErrors.length) return callback(null, stringValidationErrors);

  const oneQuerySelectedErrors =
    !(options.queryIssues.value ||
    options.queryVulnerabilities.value ||
    options.queryAssets.value) ? [
      {
        key: 'queryIssues',
        message: 'At least one of these Query options must be checked'
      },
      {
        key: 'queryVulnerabilities',
        message: 'At least one of these Query options must be checked'
      },
      {
        key: 'queryAssets',
        message: 'At least one of these Query options must be checked'
      }
    ] : [];

  if (oneQuerySelectedErrors.length) return callback(null, oneQuerySelectedErrors);

  const endingSlashError = options.authTokenDomain.value.endsWith('/')
    ? [
        {
          key: 'authTokenDomain',
          message: 'Only Domain allowed, no trailing slash / allowed'
        }
      ]
    : [];
  const protocolError = options.authTokenDomain.value.startsWith('http')
    ? [
        {
          key: 'authTokenDomain',
          message: 'Only Domain allowed, http(s) not allowed'
        }
      ]
    : [];

  callback(null, endingSlashError.concat(protocolError));
};

module.exports = validateOptions;
