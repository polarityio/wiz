const { size, map, some } = require('lodash/fp');
const { getResultForThisEntity } = require('./dataTransformations');

const assembleLookupResults = (entities, issues, vulnerabilities, assets, options) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(
      entity,
      issues,
      vulnerabilities,
      assets,
      options
    );

    const resultsFound = some(size, resultsForThisEntity);

    const lookupResult = {
      entity,
      data: resultsFound
        ? {
            summary: createSummaryTags(resultsForThisEntity, options),
            details: resultsForThisEntity
          }
        : null
    };

    return lookupResult;
  }, entities);

const getResultsForThisEntity = (entity, issues, vulnerabilities, assets, options) => ({
  issues: getResultForThisEntity(entity, issues),
  vulnerabilities: getResultForThisEntity(entity, vulnerabilities),
  assets: getResultForThisEntity(entity, assets)
});

const createSummaryTags = ({ issues, vulnerabilities, assets }, options) =>
  []
    .concat(size(issues) ? `Issues: ${size(issues)}` : [])
    .concat(size(vulnerabilities) ? `Vulns: ${size(vulnerabilities)}` : [])
    .concat(size(assets) ? `Assets: ${size(assets)}` : []);

module.exports = assembleLookupResults;
