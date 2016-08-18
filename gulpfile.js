var gulp = require('gulp');
var eslint = require('gulp-eslint');
var formatter = require('eslint-friendly-formatter');
var babel = require('gulp-babel');
var nodemon = require('gulp-nodemon');
var sourcemap = require('gulp-sourcemaps');

gulp.task('compile', () => {
  return gulp.src('src/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format(formatter))
      .pipe(eslint.failAfterError())
      .pipe(sourcemap.init())
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(sourcemap.write('.', {
        sourceRoot: 'src/**/*.js'
      }))
      .pipe(gulp.dest('build'));
});

gulp.task('default', ['compile'], () => {
  nodemon({
    watch: ['src/**/*.js'],
    ext: 'js json',
    tasks: ['compile'],
    script: 'build/app.js'
  });
});
