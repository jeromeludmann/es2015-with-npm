# ES2015 (ES6) Development Workflows


## Using `npm` only

```sh
npm install --save-dev eslint 
npm install --save-dev babel-cli babel-preset-es2015
```

 - **eslint** is an ES5/ES6 pattern checker
 - **babel** compile ES6 code to readable ES5

Other useful libraries:

```sh
npm install --save-dev rimraf npm-run-all nodemon
```

 - **rimraf** is a cross-platform `rm -rf`
 - **npm-run-all** helps to run npm tasks in parallel or sequential
 - **nodemon** monitors a Node application
 
Add `scripts` entries (`package.json`):

```json
  "scripts": {
    "clean": "rimraf build",
    "eslint": "eslint src",
    "babel": "babel src --presets es2015 --source-maps -d build",
    "prestart": "run-s clean babel",
    "start": "nodemon --watch build build/app.js",
    "watch": "run-p 'babel -- --watch' start"
  },
```


## Using Gulp

Setting up:

```sh
npm install --save-dev gulp
npm install --save-dev gulp-eslint eslint-friendly-formatter
npm install --save-dev gulp-babel babel-preset-es2015
npm install --save-dev gulp-sourcemaps
```

 - **eslint-friendly-formatter** is a better formatter for IntelliJ/WebStorm

Into the `gulpfile.js`:

```js
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
```


## Source Map support

```sh
npm install --save source-map-support
```

 - **source-map-support** allows to get stack traces from original source code

Then import this from the entry point `src/app.js`:

```js
import 'source-map-support/register';

...
```
