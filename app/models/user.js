import DS from 'ember-data';

export default DS.Model.extend({
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  email: DS.attr('string'),
  gender: DS.attr('string'),
  slug: DS.attr('string'),
  birthday: DS.attr('date'),

  user: DS.belongsTo('user', { async: true })
});
