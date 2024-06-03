const {
  validateOptionsToDoLookupOptions,
  splitCommaSeparatedUserOption
} = require('../dataTransformations');
const { queryAssets } = require('../queries');
const { validateStringOptions } = require('./utils');
const {
  logging: { getLogger },
  errors: { parseErrorToReadableJson }
} = require('polarity-integration-utils');

const validateOptions = async (options, callback) => {
  const stringOptionsErrorMessages = {
    authTokenDomain: '* Required',
    apiRegion: '* Required',
    clientId: '* Required',
    clientSecret: '* Required'
  };

  const stringValidationErrors = validateStringOptions(
    stringOptionsErrorMessages,
    options
  );

  if (stringValidationErrors.length) return callback(null, stringValidationErrors);

  const oneQuerySelectedErrors = !(
    options.queryIssues.value ||
    options.queryVulnerabilities.value ||
    options.queryAssets.value
  )
    ? [
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
      ]
    : [];

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

  const assetTypesError = options.assetQueryTypes.value.length
    ? await getAssetTypesError(options)
    : [];

  const errors = endingSlashError.concat(protocolError).concat(assetTypesError);

  callback(null, errors);
};

const getAssetTypesError = async (options) => {
  try {
    const doLookupOptions = validateOptionsToDoLookupOptions(options);

    const optionsWithParsedTypes = {
      ...doLookupOptions,
      parsedAssetQueryTypes: splitCommaSeparatedUserOption(
        'assetQueryTypes',
        doLookupOptions
      )
    };

    await queryAssets([{ id: 'foo', value: '8.8.8.8' }], optionsWithParsedTypes);

    return [];
  } catch (error) {
    getLogger().error(
      { error, formattedError: parseErrorToReadableJson(error) },
      'Search Asset Type invalid'
    );
    const message = 'One or more Search Asset Types are Invalid';
    return [{ key: 'assetQueryTypes', message }];
  }
};

module.exports = validateOptions;
