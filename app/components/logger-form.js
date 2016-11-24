import Ember from 'ember';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.set('validationErrors', {
      date: null,
      name: null,
      duration: null,
      feeling: null
    });
  },

  store: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  isSaving: false,
  savedSuccessful: false,
  // Form Values
  feelingValue: null,
  workoutTypes: [],
  workoutDate: null,
  rawDate: null,
  workoutTypeChoice: null,
  validationErrors: {},
  l1: null,
  l2: null,
  l3: null,
  l4: null,
  l5: null,
  str: null,

  resetFormAttrs() {
    this.setProperties({
      l1: null,
      l2: null,
      l3: null,
      l4: null,
      l5: null,
      str: null,
      feelingValue: null,
      workoutDate: null,
      rawDate: null,
      workoutTypeChoice: null,
      validationErrors: {}
    });
    this.$(this.element).find('input[type=date]').val('');
  },

  actions: {
    dateChanged(val) {
      const date = moment(val);
      this.set('workoutDate', date.toDate());
      this._validateDate();
    },

    workoutTypeChanged(val) {
      const wt = this.get('store').peekRecord('workoutType', val);
      this.set('workoutTypeChoice', wt);
      this._validateName();
    },

    l1DurationChanged(val) {
      this.set('l1', val);
      this._validateDuration();
    },

    l2DurationChanged(val) {
      this.set('l2', val);
      this._validateDuration();
    },

    l3DurationChanged(val) {
      this.set('l3', val);
      this._validateDuration();
    },

    l4DurationChanged(val) {
      this.set('l4', val);
      this._validateDuration();
    },

    l5DurationChanged(val) {
      this.set('l5', val);
      this._validateDuration();
    },

    strDurationChanged(val) {
      this.set('str', val);
      this._validateDuration();
    },

    feelingChanged(val) {
      this.set('feelingValue', val);
      this._validateFeeling();
    },

    saveWorkout() {
      if (this._validateForm() === false) { return; }

      const attrs = this.getProperties(
        'workoutDate', 'workoutTypeChoice', 'l1',
        'l2', 'l3', 'l4', 'l5', 'str', 'feelingValue'
      );

      this.set('isSaving', true);
      this.get('store').createRecord('workout', {
        name: attrs.workoutTypeChoice.get('name'),
        date: attrs.workoutDate,
        feeling: attrs.feelingValue,
        notes: attrs.notes,
        level1Duration: attrs.l1,
        level2Duration: attrs.l2,
        level3Duration: attrs.l3,
        level4Duration: attrs.l4,
        level5Duration: attrs.l5,
        strengthDuration: attrs.str,

        user: this.get('currentUser.user'),
        workoutType: attrs.workoutTypeChoice
      }).save().then(() => {
        this.set('isSaving', false);
        this.set('savedSuccessful', true);
        this.resetFormAttrs();
        Ember.run.later(this, () => {
          this.set('savedSuccessful', false);
        }, 2500);
      }).catch(() => {
        this.set('isSaving', false);
      });
    }
  },

  _validateForm() {
    let hasError = false;
    hasError = this._validateDate();
    hasError = this._validateDuration();
    hasError = this._validateName();
    hasError = this._validateFeeling();
    return hasError;
  },

  _validateDate() {
    if (!this.get('workoutDate')) {
      this.set('validationErrors.date', 'Please select a day');
      return false;
    }
    this.set('validationErrors.date', null);
    return null;
  },

  _validateName() {
    if (!this.get('workoutTypeChoice')) {
      this.set('validationErrors.name', 'Please select a discipline');
      return false;
    }
    this.set('validationErrors.name', null);
    return null;
  },

  _validateDuration() {
    const attrs = this.getProperties('l1', 'l2', 'l3', 'l4', 'l5', 'str');
    if (!attrs.l1 && !attrs.l2 && !attrs.l3 && !attrs.l4 && !attrs.l5 && !attrs.str) {
      this.set('validationErrors.duration', 'Please add a duration');
      return false;
    }
    this.set('validationErrors.duration', null);
    return null;
  },

  _validateFeeling() {
    if (!this.get('feelingValue')) {
      this.set('validationErrors.feeling', 'Please select a feeling');
      return false;
    }
    this.set('validationErrors.feeling', null);
    return null;
  }
});
