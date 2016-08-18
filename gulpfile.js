var gulp = require('gulp');
var eslint = require('gulp-eslint');
var formatter = require('eslint-friendly-formatter');
var babel = require('gulp-babel');
var sourcemap = require('gulp-sourcemaps');

gulp.task('eslint', () => {
  return gulp.src(__dirname + '/src/**/*/js')
      .pipe(eslint())
      .pipe(eslint.format(formatter))
      .pipe(eslint.failAfterError());
});

gulp.task('babel', ['eslint'], () => {
  return gulp.src(__dirname + '/src/**/*.js')
      .pipe(sourcemap.init())
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(sourcemap.write('.', {
        sourceRoot: __dirname + '/src'
      }))
      .pipe(gulp.dest(__dirname + '/build'));
});

gulp.task('default', ['babel'], () => {
  gulp.watch([
    __dirname + '/src/**/*.js'
  ], [
    'babel'
  ]);
});