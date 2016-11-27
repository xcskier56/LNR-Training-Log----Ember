export default function () {
  this.transition(
    this.fromRoute('home.workouts.index'),
    this.toRoute('home.workouts.workout'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
