import Ember from 'ember';

const { Service } = Ember;

export default Service.extend({
  resizeService: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.windowResizeHandler = (e) => { this._windowWasResized(e); };
    console.log(resizeService)
  },

  _windowWasResized(e) {

  }
});
