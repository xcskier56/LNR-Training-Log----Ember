import ActiveModelAdapter from 'active-model-adapter';
import Ember from 'ember';

export default ActiveModelAdapter.extend({
  cacheExpirationLength: 1800000,
  namespace: 'api/v1',
  coalesceFindRequests: true,
  authorizer: 'authorizer:application',
  session: Ember.inject.service(),

  headers: Ember.computed('session.isAuthenticated', function headers() {
    if (this.get('session.isAuthenticated')) {
      const authHeaders = this.headersForAuthenticated();

      return authHeaders;
    }
    const token = Ember.$('meta[name="csrf-token"]').attr('content');
    return {
      'X-CSRF-Token': token
    };
  }),

  headersForAuthenticated() {
    const token = Ember.$('meta[name="csrf-token"]').attr('content');
    const authorizer = this.get('authorizer');
    let authHeaders;
    this.get('session').authorize(authorizer, (headers) => {
      authHeaders = {
        'X-CSRF-Token': token,
        'access-token': headers['access-token'],
        expiry: headers.expiry,
        client: headers.client,
        'token-type': 'Bearer',
        uid: headers.uid
      };
    });

    return authHeaders;
  },

  handleResponse: function handleResponse(status) {
    if (status === 401 && this.get('session.isAuthenticated')) {
      this.get('session').invalidate();
    }
    return this._super.apply(this, arguments);
  },

  findRecord(store, type, id, snapshot) {
    const key = `${snapshot.type.modelName}-${snapshot.id}`;
    this.DataRequestLog.push(key);
    return this._super(...arguments);
  },

  shouldBackgroundReloadAll() {
    return true;
  },

  shouldBackgroundReloadRecord() {
    return true;
  },

  shouldReloadAll() {
    return false;
  },

  shouldReloadRecord() {
    return false;
  }
});
