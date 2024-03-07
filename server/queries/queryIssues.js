const { MAX_PAGE_SIZE } = require('../constants');

const queryEntitiesWithQueryStringBuilder = require('./queryEntitiesWithQueryStringBuilder');

const queryIssues = async (cveEntities, options) =>
  await queryEntitiesWithQueryStringBuilder(cveEntities, options, buildIssuesQueryString);

const buildIssuesQueryString = (entity) => `
  ${entity.id}: issuesV2(
    first: ${MAX_PAGE_SIZE},
    filterBy: { search: "${entity.value}" }
  ) {
    nodes {
      id
      description
      type
      status
      severity
      evidenceQuery
      openReason

      createdAt
      updatedAt
      dueAt
      resolvedAt
      statusChangedAt
      rejectionExpiredAt

      entity {
        id
        type
        name
        properties
        firstSeen
        lastSeen
      }

      entitySnapshot {
        id
        name
        type
        status
      }

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
    }
  }`;

module.exports = queryIssues;
