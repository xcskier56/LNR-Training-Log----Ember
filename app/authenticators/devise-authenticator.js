import Ember from 'ember';
import DeviseAuthenticator from 'ember-simple-auth/authenticators/devise';

const { RSVP, isEmpty, run } = Ember;

export default DeviseAuthenticator.extend({
  serverTokenEndpoint: 'api/v1/auth/sign_in',
  serverTokenDestroyEndpoint: 'api/v1/auth/sign_out',
  ajax: Ember.inject.service(),

  restore(data) {
    return new RSVP.Promise((resolve, reject) => {
      if (!isEmpty(data.accessToken) && !isEmpty(data.expiry) &&
          !isEmpty(data.tokenType) && !isEmpty(data.uid) && !isEmpty(data.client)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  authenticate(identification, password) {
    return new RSVP.Promise((resolve, reject) => {
      const { identificationAttributeName } = this.getProperties('identificationAttributeName');
      const data = { password };
      data[identificationAttributeName] = identification;

      this.makeRequest(data).then((response, status, xhr) => {
        // save the five headers needed to send to devise-token-auth
        // when making an authorized API call
        var result = {
          accessToken: xhr.getResponseHeader('access-token'),
          expiry: xhr.getResponseHeader('expiry'),
          tokenType: xhr.getResponseHeader('token-type'),
          uid: xhr.getResponseHeader('uid'),
          client: xhr.getResponseHeader('client')
        };

        run(null, resolve, result);
      }, (xhr) => {
        run(null, reject, xhr.responseJSON || xhr.responseText);
      });
    });
  },

  invalidate() {
    const serverTokenDestroyEndpoint = this.get('serverTokenDestroyEndpoint');
    return this.get('ajax').request(serverTokenDestroyEndpoint).catch(() => {
      return true;
    });
  },

  makeRequest(data, options) {
    const serverTokenEndpoint = this.get('serverTokenEndpoint');
    const requestOptions = Ember.$.extend({}, {
      url: serverTokenEndpoint,
      type: 'POST',
      dataType: 'json',
      data,
      beforeSend(xhr, settings) {
        xhr.setRequestHeader('Accept', settings.accepts.json);
      }
    }, options || {});

    return Ember.$.ajax(requestOptions);
  }
});
