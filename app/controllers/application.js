import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({
  userAgent: service(),

  init() {
    this._super(...arguments);
    console.log(this.get('userAgent'))
  }
});
