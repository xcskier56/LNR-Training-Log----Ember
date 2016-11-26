import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function routerMap() {
  this.route('login');
  this.route('home', function () {
    this.route('logger');
    this.route('workouts');
    this.route('settings');
    this.route('users', function () {
      this.route('user', { path: '/:user_slug' }, function () {});
    });
    this.route('teams', function () {
      this.route('team', { path: '/:team_slug' }, function () {});
    });
  });
});

export default Router;
