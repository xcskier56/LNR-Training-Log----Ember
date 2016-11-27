import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      workouts: this.store.peekAll('workout'),
      workoutQuery: this.store.query('workout', {
        offset: 0,
        range_type: 'monthly'
      })
    });
  }
});
