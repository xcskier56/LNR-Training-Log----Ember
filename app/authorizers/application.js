import Ember from 'ember';
import DeviseAuthorizer from 'ember-simple-auth/authorizers/devise';

const { isEmpty } = Ember;

export default DeviseAuthorizer.extend({
  tokenAttributeName: 'accessToken',
  identificationAttributeName: 'uid',
  session: Ember.inject.service(),

  authorize(data, block) {
    const { tokenAttributeName, identificationAttributeName } = this.getProperties('tokenAttributeName', 'identificationAttributeName');

    const accessToken        = data[tokenAttributeName];
    const userIdentification = data[identificationAttributeName];
    const tokenExpiry        = data.expiry;
    const client             = data.client;

    if (!isEmpty(accessToken) && !isEmpty(userIdentification)) {
      const headerData = {
        'access-token': accessToken,
        'uid': userIdentification,
        'expiry': tokenExpiry,
        'client': client
      }

      block(headerData);
    }
  }
});
