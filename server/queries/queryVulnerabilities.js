const { MAX_PAGE_SIZE } = require('../constants');

const queryEntitiesWithQueryStringBuilder = require('./queryEntitiesWithQueryStringBuilder');

const queryVulnerabilities = async (cveEntities, options) =>
  await queryEntitiesWithQueryStringBuilder(cveEntities, options, buildVulnerabilitiesQueryString);

const buildVulnerabilitiesQueryString = (entity) => `
  ${entity.id}: vulnerabilityFindings(
    first: ${MAX_PAGE_SIZE},
    filterBy: { vulnerabilityExternalId: ["${entity.value}"] }
  ) {
    nodes {
      id
      portalUrl
      name
      CVEDescription
      CVSSSeverity
      score
      exploitabilityScore
      impactScore
      dataSourceName
      hasExploit
      hasCisaKevExploit
      status
      vendorSeverity
      firstDetectedAt
      lastDetectedAt
      resolvedAt
      description
      remediation
      detailedName
      version
      fixedVersion
      detectionMethod
      link
      locationPath
      resolutionReason
      epssSeverity
      epssPercentile
      epssProbability
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
      vulnerableAsset {
        ... on VulnerableAssetBase {
          id
          type
          name
          region
          cloudProviderURL
          cloudPlatform
          status
          subscriptionName
          subscriptionExternalId
          subscriptionId
        }
        ... on VulnerableAssetVirtualMachine {
          ipAddresses
        }
      }
    }
  }`;

module.exports = queryVulnerabilities;
