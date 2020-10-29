# npm-workflow

> **DEPRECATED: Do not follow what is written below. There are a lot of tools today to do that in a good way.**

Below is a TypeScript-oriented build workflow using `npm`, without Grunt or Gulp, for front and back-end JavaScript development.

## TypeScript as a superset of JavaScript

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
  "exclude": ["node_modules", "build", "test"]
}
```

Initialize `tslint.json`:

```sh
./node_modules/.bin/tslint --init
```

Add to `package.json`:

```json
"scripts": {
  "lint:tslint": "tslint $(find src test -name '*.ts')",
  "build:tsc": "tsc --rootDir src --sourceMap --outDir build/.tmp/es6",
}
```

## ES2015 (ES6) to ES5 JavaScript

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
  "presets": ["es2015"],
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
  "lint:eslint": "eslint src test",
  "build:babel": "babel build/.tmp/es6 --source-maps --out-dir build/.tmp/es5",
}
```

## Bundling dependencies (client side)

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

## Test-Driven Development

Install dependencies:

```sh
npm install --save-dev mocha
npm install --save-dev chai
```

- `chai` is an assertion library for TDD/BDD

Add to `package.json`:

```json
"scripts": {
  "test": "mocha --require ts-node/register --recursive test/**/*.test.ts",
}
```

- argument `--require ts-node/register` compiles TypeScript on the fly

## Multi-level Source Map

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

## Source Map support

**Server side**

Get `source-map-support`:

```sh
npm install --save source-map-support
```

Add `--require source-map-support/register` to node arguments:

```json
"scripts": {
  "start": "node --require source-map-support/register build/app.js",
}
```

**Client side**

Just install:

```sh
npm install --save-dev live-server
```

Add to `package.json`:

```json
"scripts": {
  "start": "live-server build",
}
```

and open **Developer Tools** from browser menu.

## Make these things work together

Install command-line tools:

```sh
npm install --save-dev npm-run-all
npm install --save-dev nodemon
npm install --save-dev rimraf
npm install --save-dev mkdirp
```

- `npm-run-all` runs multiple scripts in parallel or sequential
- `nodemon` monitors for any changes (like `gulp.watch()`)
- `rimraf` is a cross-platform `rm -rf`
- `mkdirp` is a cross-platform `mkdir -p`

Add to `package.json`:

```json
"scripts": {
  "lint": "npm-run-all --parallel lint:eslint lint:tslint",
  "build": "npm-run-all --sequential build:tsc build:babel build:browserify build:uglify build:sorcery",
  "watch:test": "nodemon --watch test --ext ts,js --exec 'npm-run-all --parallel lint test'",
  "watch:build": "nodemon --watch src --ext ts,js --exec 'npm-run-all --parallel lint test --sequential build'",
  "watch:copy": "nodemon --watch src --ext html,css --exec 'npm run copy'",
  "watch:start": "nodemon --watch build --ext js,html,css --exec 'npm run start'",
  "watch": "npm-run-all --parallel watch:*"
}
```

## Finally

`package.json` looks like:

**Server side**

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "npm workflow for back-end development",
  "scripts": {
    "lint:eslint": "eslint src test",
    "lint:tslint": "tslint $(find src test -name '*.ts')",
    "lint": "npm-run-all --parallel lint:eslint lint:tslint",
    "test": "mocha --require ts-node/register --recursive test/**/*.test.ts",
    "clean": "rimraf build",
    "build:tsc": "tsc --rootDir src --sourceMap --outDir build/.tmp/es6",
    "build:babel": "babel build/.tmp/es6 --source-maps --out-dir build/.tmp/es5",
    "build:sorcery": "sorcery --input build/.tmp/es5 --output build",
    "build": "npm-run-all --sequential build:tsc build:babel build:sorcery",
    "postbuild": "rimraf build/.tmp",
    "start": "node --require source-map-support/register build/app.js",
    "watch:test": "nodemon --watch test --ext ts,js --exec 'npm-run-all --parallel lint test'",
    "watch:build": "nodemon --watch src --ext ts,js --exec 'npm-run-all --parallel lint test --sequential build'",
    "watch:start": "nodemon --watch build --ext js --exec 'npm run start'",
    "prewatch": "npm run clean",
    "watch": "npm-run-all --parallel watch:*"
  },
  "devDependencies": {
    "babel-cli": "^6.14.0",
    "babel-plugin-transform-runtime": "^6.15.0",
    "babel-preset-es2015": "^6.14.0",
    "eslint": "^3.4.0",
    "mocha": "^3.0.2",
    "nodemon": "^1.10.2",
    "npm-run-all": "^3.1.0",
    "rimraf": "^2.5.4",
    "sorcery": "^0.10.0",
    "ts-node": "^1.3.0",
    "tslint": "^3.15.1",
    "typescript": "^1.8.10"
  },
  "dependencies": {
    "source-map-support": "^0.4.2"
  }
}
```

**Client side**

```json
{
  "name": "client",
  "version": "1.0.0",
  "description": "npm workflow for front-end development",
  "scripts": {
    "lint:eslint": "eslint src test",
    "lint:tslint": "tslint $(find src test -name '*.ts')",
    "lint": "npm-run-all --parallel lint:*",
    "test": "mocha --require ts-node/register --recursive test/**/*.test.ts",
    "clean": "rimraf build",
    "copy": "mkdirp build && cp -r src/public/* build",
    "build:tsc": "tsc --rootDir src --sourceMap --outDir build/.tmp/es6",
    "build:babel": "babel build/.tmp/es6 --source-maps --out-dir build/.tmp/es5",
    "build:browserify": "browserify build/.tmp/es5/app.js --debug | exorcist build/bundle.js.map --base build > build/bundle.js",
    "build:uglify": "uglifyjs build/bundle.js --compress --mangle --source-map build/bundle.min.js.map --prefix relative --output build/bundle.min.js",
    "build:sorcery": "sorcery --input build/bundle.min.js",
    "build": "npm-run-all --sequential build:tsc build:babel build:browserify build:uglify build:sorcery",
    "postbuild": "rimraf build/.tmp",
    "start": "live-server build",
    "watch:test": "nodemon --watch test --ext ts,js --exec 'npm-run-all --parallel lint test'",
    "watch:build": "nodemon --watch src --ext ts,js --exec 'npm-run-all --parallel lint test --sequential build'",
    "watch:copy": "nodemon --watch src --ext html,css --exec 'npm run copy'",
    "watch:start": "nodemon --watch build --ext js,html,css --exec 'npm run start'",
    "prewatch": "npm run clean",
    "watch": "npm-run-all --parallel watch:*"
  },
  "devDependencies": {
    "babel-cli": "^6.14.0",
    "babel-plugin-transform-runtime": "^6.15.0",
    "babel-preset-es2015": "^6.14.0",
    "browserify": "^13.1.0",
    "eslint": "^3.4.0",
    "exorcist": "^0.4.0",
    "live-server": "^1.1.0",
    "livereload": "^0.5.0",
    "mocha": "^3.0.2",
    "nodemon": "^1.10.2",
    "npm-run-all": "^3.1.0",
    "rimraf": "^2.5.4",
    "sorcery": "^0.10.0",
    "ts-node": "^1.3.0",
    "tslint": "^3.15.1",
    "typescript": "^1.8.10",
    "uglify-js": "^2.7.3"
  }
}
```
