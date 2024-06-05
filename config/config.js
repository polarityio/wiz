module.exports = {
  name: 'Wiz',
  acronym: 'WIZ',
  description:
    'Search Wiz for Issues and Vulnerabilities by CVEs and Assets by IP Addresses, Domains, and CVEs',
  entityTypes: ['cve', 'IPv4', 'domain'],
  defaultColor: 'light-blue',
  onDemandOnly: true,
  styles: ['./client/styles.less'],
  block: {
    component: {
      file: './client/block.js'
    },
    template: {
      file: './client/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: ''
  },
  logging: {
    level: 'info'
  },
  options: [
    {
      key: 'authTokenDomain',
      name: 'Authentication Token Domain',
      description: 'The Domain used to obtain your WIZ Authentication Token',
      default: 'auth.app.wiz.io',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'apiRegion',
      name: 'API Region',
      description:
        'The region where the API User resides.  (e.g., us1, us2, eu1, eu2 ...)',
      default: 'us1',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientId',
      name: 'Client ID',
      description: 'Your Wiz Client ID',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientSecret',
      name: 'Client Secret',
      description: 'Your Wiz Client Secret',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'queryIssues',
      name: 'Query Issues',
      description:
        "Uncheck if you don't wish to Query Issues.",
      default: true,
      type: 'boolean',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'queryVulnerabilities',
      name: 'Query Vulnerabilities',
      description:
        "Uncheck if you don't wish to Query Vulnerabilities.",
      default: true,
      type: 'boolean',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'queryAssets',
      name: 'Query Assets',
      description:
        "Uncheck if you don't wish to Query Assets.",
      default: true,
      type: 'boolean',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'assetQueryTypes',
      name: 'Asset Query Types',
      description:
        'A comma separated list of Asset(Cloud Resource) Types you want results to return for. If left empty, will return all Asset Types.',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
