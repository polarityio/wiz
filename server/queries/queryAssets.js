const { MAX_PAGE_SIZE } = require('../constants');

const queryEntitiesWithQueryStringBuilder = require('./queryEntitiesWithQueryStringBuilder');

const queryAssets = async (entitiesWithIds, options) =>
  await queryEntitiesWithQueryStringBuilder(
    entitiesWithIds,
    options,
    buildAssetQueryString
  );

const buildAssetQueryString = (entity, options) => `
  ${entity.id}: cloudResources(
    first: ${MAX_PAGE_SIZE}, 
    filterBy: { 
      search: "${entity.value}",
      ${options.parsedAssetQueryTypes.length ? `type: ${JSON.stringify(options.parsedAssetQueryTypes)}` : ''}
    }
  ) {
    nodes {
      ... on CloudResource {
        id
        name
        type
        subscriptionName
        
        graphEntity {
          id
          name
          type
          firstSeen
          lastSeen
          properties
          projects {
            id
            name
            description
            businessUnit
            riskProfile {
              businessImpact
              hasExposedAPI
            }
          }
          technologies {
            name
            description
            risk
            propertySections {
              name
              properties {
                name
                value
              }
            }
          }
        }
      }
    }
  }`;

module.exports = queryAssets;
