var gulp  = require('gulp');
var less  = require('gulp-less');
var watch = require('gulp-watch');

gulp.task('default', ['compile-less', 'watch-less']);

gulp.task('compile-less', function() {
  gulp.src('./assets/css/*.less')
    .pipe(less())
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('watch-less', function() {
  gulp.watch('./assets/css/*.less' , ['compile-less']);
});
