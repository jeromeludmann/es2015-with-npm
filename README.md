npm-workflow
============

Below is a TypeScript-oriented build workflow using `npm`, without Grunt or Gulp, for front and back-end JavaScript development.

TypeScript as a superset of JavaScript
--------------------------------------

Install TypeScript compiler and linter:

```sh
npm install --save-dev typescript
npm install --save-dev tslint
```

Configure `tsconfig.json`:

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "noImplicitAny": false,
    "sourceMap": true,
    "listFiles": true,
    "pretty": true,
    "allowJs": true
  },
  "exclude": [
    "node_modules",
    "build"
  ]
}
```

Initialize `tslint.json`:

```sh
./node_modules/.bin/tslint --init
```

Add to `package.json`:

```json
"scripts": {
  "lint:tslint": "tslint $(find src -name '*.ts')",
  "build:tsc": "tsc --rootDir src --sourceMap --outDir build/.tmp/es6",
}
```

ES2015 (ES6) to ES5 JavaScript
------------------------------

Install Babel and ESLint:

```sh
npm install --save-dev babel-cli babel-preset-es2015 babel-plugin-transform-runtime
npm install --save-dev eslint
```

- `babel-preset-es2015` enables all ES2015 (ES6) features
- `babel-plugin-transform-runtime` externalizes some helpers for ES7 features (like `async`)

Add to `.babelrc`:

```json
{
  "presets": [
    "es2015"
  ],
  "plugins": [
    [
      "transform-runtime",
      {
        "polyfill": false,
        "regenerator": true
      }
    ]
  ]
}
```

Initialize `.eslintrc.json`:

```sh
./node_modules/.bin/eslint --init
```

Add to `package.json`:

```json
"scripts": {
  "lint:eslint": "eslint src",
  "build:babel": "babel build/.tmp/es6 --source-maps --out-dir build/.tmp/es5",
}
```

Bundling dependencies (browser-side)
------------------------------------

Install Browserify and UglifyJS:

```sh
npm install --save-dev browserify exorcist
npm install --save-dev uglify-js
```

- `exorcist` gets the Source Map from Browserify stream 

Add to `package.json`:

```json
"scripts": {
  "build:browserify": "browserify build/.tmp/es5/app.js --debug | exorcist build/bundle.js.map --base build > build/bundle.js",
  "build:uglify": "uglifyjs build/bundle.js --compress --mangle --source-map build/bundle.min.js.map --prefix relative --output build/bundle.min.js",
}
```

Multi-level Source Map
----------------------

```sh
npm install --save-dev sorcery
```

- `sorcery` generates Source Maps by resolving a chain of Source Maps

Add to `package.json`:

```json
"scripts": {
  "build:sorcery": "sorcery --input build/bundle.min.js",
}
```

Source Map support
------------------

### Node-side support

```sh
npm install --save source-map-support
```

Add `--require source-map-support/register` to node arguments:

```json
"scripts": {
  "start": "node --require source-map-support/register build/app.js",
}
```

### Browser-side support

Open _Developer Tools_ from browser menu. 

Make these things work together
-------------------------------

Install command-line tools:

```sh
npm install --save-dev npm-run-all
npm install --save-dev nodemon
npm install --save-dev rimraf
```

- `npm-run-all` runs multiple scripts in parallel or sequential
- `nodemon` monitors for any changes (like `gulp.watch()`)
- `rimraf` is a cross-platform `rm -rf`

`package.json`:

```json
"scripts": {
  "lint": "npm-run-all --parallel lint:eslint lint:tslint",
  "build": "npm-run-all --sequential build:tsc build:babel build:browserify build:uglify build:sorcery build:html",
  "watch": "nodemon --watch src --ext ts,js --exec 'npm-run-all --parallel test lint --sequential clean build start'"
  }
```

Finally
-------

`package.json` looks like:

### Node-side

```json
  "scripts": {
    "test": "mocha --require ts-node/register --recursive test/**/*.test.ts",
    "clean": "rimraf build",
    "lint:eslint": "eslint src",
    "lint:tslint": "tslint $(find src -name '*.ts')",
    "lint": "npm-run-all --parallel lint:eslint lint:tslint",
    "build:tsc": "tsc --rootDir src --sourceMap --outDir build/.tmp/es6",
    "build:babel": "babel build/.tmp/es6 --source-maps --out-dir build/.tmp/es5",
    "build:sorcery": "sorcery --input build/.tmp/es5 --output build",
    "build": "npm-run-all --sequential build:tsc build:babel build:sorcery",
    "postbuild": "rimraf build/.tmp",
    "start": "node --require source-map-support/register build/app.js",
    "watch": "nodemon --watch src --ext ts,js --exec 'npm-run-all --parallel test lint --sequential clean build start'"
  }
```

### Browser-side

```json
  "scripts": {
    "test": "mocha --require ts-node/register --recursive test/**/*.test.ts",
    "clean": "rimraf build",
    "lint:eslint": "eslint src",
    "lint:tslint": "tslint $(find src -name '*.ts')",
    "lint": "npm-run-all --parallel lint:eslint lint:tslint",
    "build:tsc": "tsc --rootDir src --sourceMap --outDir build/.tmp/es6",
    "build:babel": "babel build/.tmp/es6 --source-maps --out-dir build/.tmp/es5",
    "build:browserify": "browserify build/.tmp/es5/app.js --debug | exorcist build/bundle.js.map --base build > build/bundle.js",
    "build:uglify": "uglifyjs build/bundle.js --compress --mangle --source-map build/bundle.min.js.map --prefix relative --output build/bundle.min.js",
    "build:sorcery": "sorcery --input build/bundle.min.js",
    "build:html": "mkdir -p build && cp -r src/public/* build",
    "build": "npm-run-all --sequential build:tsc build:babel build:browserify build:uglify build:sorcery build:html",
    "start": "http-server -p 8080 build",
    "watch": "nodemon --watch src --ext ts,js --exec 'npm-run-all --parallel test lint --sequential clean build'"
  }
```
