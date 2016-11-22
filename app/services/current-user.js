import Ember from 'ember';

const { inject: { service }, Service } = Ember;

export default Service.extend({
  session: service('session'),
  store: service(),
  user: null,
  takenAssessment: Ember.computed.bool('user.takenAssessment'),

  load() {
    if (this.get('session.isAuthenticated')) {
      return this.get('store').queryRecord('user', { currentUser: true }).then((user) => {
        this.set('user', user);
      });
    }
    return null;
  }
});
