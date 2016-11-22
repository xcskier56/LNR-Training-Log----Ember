import Ember from 'ember';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  shouldBackgroundReloadAll(store, snapshotRecordArray) {
    return this.DataRequestLog.shouldReload(snapshotRecordArray.type.modelName, this.get('cacheExpirationLength'));
  },
  shouldBackgroundReloadRecord(store, snapshot) {
    return this.DataRequestLog.shouldReload(snapshot.type.modelName + '-' + snapshot.id, this.get('cacheExpirationLength'));
  },

  /*
    findRecord will not work for getting a record based off of a slug.
    This is because ember creates a new model with id: slug.

    The solution to this is to use queryRecord.
    But if we pass the slug, or user_slug to the queryRecord, we
    want to it go to /users/:slug instead of as a query param.
    This lets us do that.
   */
  queryRecord(store, type, query) {
    var queryKeys, url;
    queryKeys = Ember.A(Object.keys(query));
    if (queryKeys.indexOf('slug') > -1) {
      url = this._buildURL(type.modelName, query.slug);
      return this.ajax(url, 'GET');
    } else if (queryKeys.indexOf('user_slug') > -1) {
      url = this._buildURL(type.modelName, query.user_slug);
      return this.ajax(url, 'GET');
    } else if (queryKeys.indexOf('currentUser') > -1) {
      // Allow current users action
      return this.ajax(this.urlForCurrentAction(), 'GET');
    }

    let newQuery = query;
    url = this.buildURL(type.modelName, null, null, 'queryRecord', query);
    if (this.sortQueryParams) {
      newQuery = this.sortQueryParams(query);
    }
    return this.ajax(url, 'GET', {
      data: newQuery
    });
  },

  urlForCurrentAction() {
    return `${this.buildURL('users')}/current`;
  }
});
