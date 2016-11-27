import DS from 'ember-data';
import Ember from 'ember';

const { computed } = Ember;

export default DS.Model.extend({
  name: DS.attr('string'),
  date: DS.attr('date'),
  feeling: DS.attr('number'),
  notes: DS.attr('string'),
  level1Duration: DS.attr('number', { defaultValue: 0 }),
  level2Duration: DS.attr('number', { defaultValue: 0 }),
  level3Duration: DS.attr('number', { defaultValue: 0 }),
  level4Duration: DS.attr('number', { defaultValue: 0 }),
  level5Duration: DS.attr('number', { defaultValue: 0 }),
  strengthDuration: DS.attr('number', { defaultValue: 0 }),

  user: DS.belongsTo('user'),
  workoutType: DS.belongsTo('workoutType'),

  formattedDate: computed('date', function () {
    return moment(this.get('date')).format('M/D/YYYY');
  }),

  weekDay: computed('date', function() {
    return moment(this.get('date')).format('ddd');
  }),

  totalDuration: computed('level1Duration', 'level2Duration', 'level3Duration', 'level4Duration',
    'level5Duration', function () {
      const attrs = this.getProperties('level1Duration', 'level2Duration', 'level3Duration', 'level4Duration', 'level5Duration');
      return Object.values(attrs)
        .filter((a) => { return !!a; })
        .reduce((a, b) => { return a + b; }, 0);
    }),

  formattedTotalDuration: computed('totalDuration', function () {
    const milliseconds = parseInt(this.get('totalDuration'), 10) * 60 * 1000;
    return moment.utc(milliseconds).format('H:mm');
  })
});
