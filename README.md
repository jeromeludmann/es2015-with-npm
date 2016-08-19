# ES2015 (ES6) Development Workflows

For npm and gulp.

_Using npm instead of gulp allows to avoid adding complexity about multiple APIs._ 

## Using `npm` only

There are two great magical tools: 

```sh
npm install --save-dev npm-run-all
npm install --save-dev nodemon
```

 - **[npm-run-all](https://github.com/mysticatea/npm-run-all)** runs multiple scripts in parallel or sequential
 - **[nodemon](https://github.com/remy/nodemon)** monitors for any changes (like `gulp.watch()`)


```sh
npm install --save-dev eslint 
npm install --save-dev babel-cli babel-preset-es2015
```

 - **eslint** checks JavaScript code style 
 - **babel-cli** - _the babel command-line tool_ - compiles ES6 code to readable ES5 JavaScript

```sh
npm install --save-dev rimraf
```

 - **rimraf** is a cross-platform `rm -rf`
 
Script entries into `package.json`:

```json
 "scripts": {
    "lint": "eslint src",
    "clean": "rimraf build",
    "build": "babel src --presets es2015 --source-maps -d build",
    "start": "node build/app.js",
    "dev": "nodemon --watch src -e js --exec 'npm-run-all -l -p lint clean -s build start'"
  },
```

About `dev` task, nodemon watches `src` directory for any changes and runs:

 1. `lint` and `clean` in parallel
 2. `build`
 3. `start`
 
 
## Using Gulp

Setting up:

```sh
npm install --save-dev gulp
npm install --save-dev gulp-eslint eslint-friendly-formatter
npm install --save-dev gulp-babel babel-preset-es2015
npm install --save-dev gulp-nodemon
npm install --save-dev gulp-sourcemaps
```

 - **eslint-friendly-formatter** is a better formatter for IntelliJ/WebStorm

Into the `gulpfile.js`:

```js
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
