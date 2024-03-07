module.exports = {
  name: 'WIZ.IO',
  acronym: 'WIZ',
  description:
    'Search WIZ.IO for Issues and Vulnerabilities by CVEs and Assets by IP Addresses, Domains, and CVEs',
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
      key: 'clientId',
      name: 'Client ID',
      description:
        'Your WIZ Client ID. Obtain yours here: https://partners.wiz.io/prm/english/c/Integration-API-Signup',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientSecret',
      name: 'Client Secret',
      description:
        'Your WIZ Client Secret. Obtain yours here: https://partners.wiz.io/prm/english/c/Integration-API-Signup',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
