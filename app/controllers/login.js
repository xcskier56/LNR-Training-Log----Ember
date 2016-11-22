import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({
  session: service('session'),

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');

      this.get('session').authenticate('authenticator:DeviseAuthenticator', identification, password).catch((reason) => {
        if (reason.errors) {
          this.set('errorMessage', reason.errors[0] || reason);
        }
      });
    }
  }
});
