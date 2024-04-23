# Polarity Wiz Endpoint Utilization Documentation

Outside of authentication, we use only use the graphql endpoint for the Polarity Integration with the Wiz API. We allow for users of the Polarity Wiz Integration to select their own region depending on their location:
`https://api.<region>.app.wiz.io/graphql`

These are the queries that we use in the Polarity Integration with the Wiz API.
## Integration Queries
### Cloud Resources
```graphql
cloudResources(
  first: 10, 
  filterBy: { search: "<CVE-or-IP-or-Domain-value>" }
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
}
```

### Issues V2
```graphql
issuesV2(
  first: 10,
  filterBy: { search: "<CVE-value>" }
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
}
```

### Vulnerability Findings
```graphql
vulnerabilityFindings(
  first: 10,
  filterBy: { vulnerabilityExternalId: ["<CVE-value>"] }
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
}
```


## Request Throttling Used In The Integration
We limit our requests in the Polarity Integration with the Wiz API to a maximum of 1 request every 350 milliseconds. This is to ensure that we do not exceed the rate limit of 3 requests per second delineated in the documentation https://integrate.wiz.io/reference/limitations.