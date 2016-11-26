import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  workouts: null,
  // The pagination starts at 0, and when the component
  // is initialized it doesn't have a page.
  currentPage: 0,
  nextPage: 1,
  hasMoreWorkouts: true,
  isLoadingWorkouts: false,

  orderedGroupedWorkouts: Ember.computed('workouts.[]', 'mondays.[]', function () {
    const dateRange = this.get('mondays');
    const ungroupedWorkouts = this.get('workouts');
    const weekGroups = Ember.A([]);

    dateRange.forEach((monday) => {
      weekGroups.pushObject(Ember.ArrayProxy.create({
        dateInfo: Ember.Object.create({
          date: monday,
          title: this._formatWeek(monday),
          range: this._formatWeekRange(monday)
        }),
        workouts: Ember.A([]),
        weekStats: Ember.Object.create({
          duration: 0
        })
      }));
    });

    ungroupedWorkouts.forEach((workout) => {
      const dateKey = moment(workout.get('date')).startOf('isoweek').format('YYYY-MM-DD');
      const foundWeek = weekGroups.findBy('dateInfo.date', dateKey);
      foundWeek.get('workouts').pushObject(workout);
      foundWeek.weekStats.count += 1;

      if (!isNaN(workout.get('totalDuration'))) {
        foundWeek.weekStats.duration += workout.get('totalDuration');
      }
    });

    weekGroups.forEach((week) => {
      const milliseconds = week.weekStats.duration * 60 * 1000;
      if (week.weekStats.duration) {
        week.weekStats.duration = moment.utc(milliseconds).format('H:mm');
      }
    });

    return weekGroups;
  }),

  mondays: Ember.computed('workouts.[]', function () {
    const mondays = Ember.A();
    this.get('workouts').forEach((workout) => {
      const tmp = moment(workout.get('date')).startOf('isoweek').format('YYYY-MM-DD');
      if (!mondays.contains(tmp)) {
        mondays.push(tmp);
      }
    });

    return mondays.sort((a, b) => {
      return (-1) * Ember.compare(a, b);
    });
  }),

  actions: {
    loadMoreWorkouts() {
      this._loadMoreWorkouts();
    }
  },

  _loadMoreWorkouts() {
    if (!this.get('hasMoreWorkouts')) { return; }
    const offset = this.get('currentPage');
    const page = this.get('nextPage');
    this.set('isLoadingWorkouts', true);

    this.get('store').query('workout', {
      offset: offset,
      range_type: 'monthly'
    }).then((response) => {
      if (response.get('length') === 0) { this.set('hasMoreWorkouts', false); }
      this.set('currentPage', page);
      this.set('nextPage', page + 1);
    }).finally(() => {
      this.set('isLoadingWorkouts', false);
    });
  },

  _formatWeek: function (monday) {
    let str;
    const momentMonday = moment(monday);
    const currentMonday = moment().startOf('isoweek');
    const weeksAgo = currentMonday.diff(momentMonday, 'days') / 7;
    switch (weeksAgo) {
      case 0: str = 'This Week'; break;
      case 1: str = 'Last Week'; break;
      default: str = `${weeksAgo} weeks ago`;
    }
    return str;
  },

  _formatWeekRange: function (date) {
    const momentDate = moment(date);
    const monday = momentDate.startOf('isoWeek').format('MMM D');
    const sunday = momentDate.endOf('isoWeek').format('MMM D');
    return `${monday} - ${sunday}`;
  }
});
