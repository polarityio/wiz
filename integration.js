'use strict';
const {
  logging: { setLogger, getLogger },
  errors: { parseErrorToReadableJson }
} = require('polarity-integration-utils');

const { removePrivateIps, getEntityTypes, addIdsToEntities } = require('./server/dataTransformations');

const { validateOptions } = require('./server/userOptions');
const { queryIssues, queryVulnerabilities, queryAssets } = require('./server/queries');
const assembleLookupResults = require('./server/assembleLookupResults');

const doLookup = async (entities, options, cb) => {
  const Logger = getLogger();
  try {
    Logger.debug({ entities }, 'Entities');

    const searchableEntities = removePrivateIps(entities);

    const entitiesWithIds = addIdsToEntities(searchableEntities);

    const cveEntities = getEntityTypes('cve', entitiesWithIds);

    const [ issues, vulnerabilities, assets ] = await Promise.all([
      queryIssues(cveEntities, options),
      queryVulnerabilities(cveEntities, options),
      queryAssets(entitiesWithIds, options)
    ]);

    Logger.trace({ issues, vulnerabilities, assets });

    const lookupResults = assembleLookupResults(
      entities,
      issues,
      vulnerabilities,
      assets,
      options
    );


    Logger.trace({ lookupResults }, 'Lookup Results');

    cb(null, lookupResults);
  } catch (error) {
    const err = parseErrorToReadableJson(error);

    Logger.error({ error, formattedError: err }, 'Get Lookup Results Failed');
    cb({ detail: error.message || 'Lookup Failed', err });
  }
};

module.exports = {
  startup: setLogger,
  validateOptions,
  doLookup
};
