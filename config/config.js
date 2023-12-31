module.exports = {
  name: 'Wiz',
  acronym: 'WIZ',
  description: 'Wiz integration',
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: ''
  },
  logging: { level: 'info' },
  entityTypes: ['*'],
  onDemandOnly: true,
  defaultColor: 'light-blue',
  styles: ['./styles/styles.less'],
  block: {
    component: {
      file: './components/component.js'
    },
    template: {
      file: './templates/template.hbs'
    }
  },
  options: []
};
