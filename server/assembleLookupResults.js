const { size, map, some } = require('lodash/fp');
const { getResultForThisEntity } = require('./dataTransformations');
const { MAX_PAGE_SIZE } = require('./constants');

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
    .concat(
      size(issues)
        ? `Issues: ${size(issues)}${size(issues) === MAX_PAGE_SIZE ? '+' : ''}`
        : []
    )
    .concat(
      size(vulnerabilities)
        ? `Vulns: ${size(vulnerabilities)}${
            size(vulnerabilities) === MAX_PAGE_SIZE ? '+' : ''
          }`
        : []
    )
    .concat(
      size(assets)
        ? `Assets: ${size(assets)}${size(assets) === MAX_PAGE_SIZE ? '+' : ''}`
        : []
    );

module.exports = assembleLookupResults;
