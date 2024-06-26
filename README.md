# Polarity Wiz Integration

Wiz helps organizations create secure cloud environments by creating a normalizing layer between cloud environments, enabling them to rapidly identify and remove critical risks.

The Polarity Wiz integration allows Polarity to search Wiz for Issues and Vulnerabilities by CVEs and Assets by IP Addresses, Domains, and CVEs.

To learn more about Wiz, visit the [official website](https://www.wiz.io/about).

<div style="display:flex; align-items: flex-start; justify-content:flex-start; align-items:flex-start; margin-bottom: 7px">
  <img width="350" style="margin-right:7px" alt="Integration Example Vuln" src="./assets/example-vuln.png">
  <img width="350" alt="Integration Example Asset" src="./assets/example-asset.png">
</div>
<div style="display:flex; align-items: flex-start; justify-content:flex-start; align-items:flex-start;">
  <img width="350" style="margin-right:7px" alt="Integration Example Issue" src="./assets/example-issue.png">
</div>

## Wiz Integration Options
### Authentication Token Domain
The Domain used to obtain your WIZ Authentication Token

### API Region
The region where the API User resides.  (e.g., us1, us2, eu1, eu2 ...)

### Client ID
Your Wiz Client ID

### Client Secret
Your Wiz Client Secret

### Query Issues
Uncheck if you don't wish to Query Issues. (Can be done in response to 504 error)

### Query Vulnerabilities
Uncheck if you don't wish to Query Vulnerabilities. (Can be done in response to 504 error)

### Query Assets
Uncheck if you don't wish to Query Assets. (Can be done in response to 504 error)

### Asset Query Types
A comma separated list of Asset(Cloud Resource) Types you want results to return for. If left empty, will return all Asset Types.


## Installation Instructions
Installation instructions for integrations are provided on the [PolarityIO GitHub Page](https://polarityio.github.io/).

## Polarity
Polarity is a memory-augmentation platform that improves and accelerates analyst decision making. For more information about the Polarity platform please see:

https://polarity.io/
