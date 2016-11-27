import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),

  actions: {
    deleteWorkout(id) {
      const res = window.confirm('Are you sure you want to delete this workout?');
      if (res) {
        this.get('store').peekRecord('workout', id).destroyRecord();
      }
      return false;
    }
  }
});
