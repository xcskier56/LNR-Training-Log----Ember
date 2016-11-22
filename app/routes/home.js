import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { inject: { service } } = Ember;

// HomeRoute =
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  session: service('session'),
  currentUser: service(),

  beforeModel(transition) {
    if (!this.get('session.isAuthenticated')) {
      transition.abort();
      this.set('session.attemptedTransition', transition);
      this.transitionTo('login');
    }
    return this.get('currentUser').load();
  }
});
