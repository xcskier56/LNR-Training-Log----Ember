import Ember from 'ember';
const { inject: { service } } = Ember;

// HomeRoute =
export default Ember.Route.extend({
  session: service('session'),

  beforeModel() {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('home.logger');
    }
  }
});
