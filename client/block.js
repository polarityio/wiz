polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  issues: Ember.computed.alias('details.issues'),
  vulnerabilities: Ember.computed.alias('details.vulnerabilities'),
  assets: Ember.computed.alias('details.assets'),
  expandableTitleStates: Ember.computed.alias('block._state.expandableTitleStates'),
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  activeTab: 'issues',
  init() {
    this.set(
      'activeTab',
      this.issues.length > 0
        ? 'issues'
        : this.vulnerabilities.length > 0
        ? 'vulnerabilities'
        : 'assets'
    );

    if (!this.get('block._state')) {
      this.set('block._state', {});
      this.set('block._state.expandableTitleStates', {});
    }

    this._super(...arguments);
  },
  actions: {
    changeTab: function (tabName) {
      this.set('activeTab', tabName);
    },
    toggleExpandableTitle: function (index) {
      this.set(
        `block._state.expandableTitleStates.${index}`,
        !this.get(`block._state.expandableTitleStates.${index}`)
      );
    }
  }
});
