import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  authorizer: 'authorizer:application',
  session: Ember.inject.service(),
  headers: Ember.computed({
    get() {
      if (this.get('session.isAuthenticated')) {
        const authHeaders = this.headersForAuthenticated();
        return authHeaders;
      }
      const token = Ember.$('meta[name="csrf-token"]').attr('content');
      return {
        accept: 'application/json, text/javascript, version=2',
        'X-CSRF-Token': token
      };
    }
  }),

  headersForAuthenticated() {
    const token = Ember.$('meta[name="csrf-token"]').attr('content');
    const authorizer = this.get('authorizer');
    let authHeaders;
    this.get('session').authorize(authorizer, (headers) => {
      authHeaders = {
        accept: 'application/json, text/javascript, version=2',
        'X-CSRF-Token': token,
        'access-token': headers['access-token'],
        expiry: headers['expiry'],
        client: headers['client'],
        'token-type': "Bearer",
        uid: headers['uid']
      };
    });

    return authHeaders;
  }
});
