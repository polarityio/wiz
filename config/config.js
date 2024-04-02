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
        'The region where the API User resides.  (e.g. us1, us2, eu1, eu2 ...)',
      default: 'us1',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientId',
      name: 'Client ID',
      description:
        'Your Wiz Client ID',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientSecret',
      name: 'Client Secret',
      description:
        'Your Wiz Client Secret',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
