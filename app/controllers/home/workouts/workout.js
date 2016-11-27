import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),

  actions: {
    deleteWorkout(id) {
      const workout = this.get('store').peekRecord('workout', id);
      workout.destroyRecord();
      return false;
    }
  }
});
