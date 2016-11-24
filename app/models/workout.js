import DS from 'ember-data';
import Ember from 'ember';

const { computed } = Ember;

export default DS.Model.extend({
  name: DS.attr('string'),
  date: DS.attr('date'),
  feeling: DS.attr('number'),
  notes: DS.attr('string'),
  level1Duration: DS.attr('number'),
  level2Duration: DS.attr('number'),
  level3Duration: DS.attr('number'),
  level4Duration: DS.attr('number'),
  level5Duration: DS.attr('number'),
  strengthDuration: DS.attr('number'),

  user: DS.belongsTo('user'),
  workoutType: DS.belongsTo('workoutType'),

  formattedDate: computed('date', function () {
    return moment(this.get('date')).format('M/D/YYYY');
  }),

  totalDuration: computed('level1Duration', 'level2Duration', 'level3Duration', 'level4Duration',
    'level5Duration', function () {
      const attrs = this.getProperties('level1Duration', 'level2Duration', 'level3Duration', 'level4Duration', 'level5Duration');
      return Object.values(attrs)
        .filter((a) => { return !!a; })
        .reduce((a, b) => { return a + b; }, 0);
    })
});
