import Ember from 'ember';

const { Service } = Ember;

export default Service.extend({
  resize: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.windowResizeHandler = (e) => { this._windowWasResized(e); };
    this.get('resize')

    this.get('resize').on('didResize', event => {
      console.log(`width: ${window.innerWidth}, height: ${window.innerHeight}`);
    })
  },

  _windowWasResized(e) {

  }
});
