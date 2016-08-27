# npm workflow for back-end development

## TypeScript

Dependencies:

```sh
npm install --save-dev typescript
npm install --save-dev tslint
./node_modules/.bin/tslint --init
```

If we have third-party JavaScript to include:
 
 ```sh
 npm install --save-dev eslint
 ./node_modules/.bin/eslint --init
 ```

`tsconfig.json`:

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

See also `tslint.json` and `.eslintrc.json`.

`package.json`:

```json
"scripts": {
  "lint:ts": "tslint src/**/*.ts",
  "lint:js": "eslint src/**/*.js",
  "tsc": "tsc --rootDir src --sourceMap --outDir build/.es6",
}
```

## ES2015 (ES6) to ES5 JavaScript

Dependencies:

```sh
npm install --save-dev babel-cli
npm install --save-dev babel-preset-es2015
npm install --save-dev babel-plugin-transform-runtime
```

- `babel-preset-es2015` enables all ES2015 (ES6) features
- `babel-plugin-transform-runtime` externalizes some helpers for ES7 features (like `async/await`)

`package.json`:

```json
"scripts": {
  "babel": "babel build/.es6 --source-maps --out-dir build/.es5",
}
```


## Source Map support

Dependencies:

```sh
npm install --save source-map-support
npm install --save-dev sorcery
```

- `source-map-support` adds Source Map support for Node stack traces
- `sorcery` resolves a chain of Source Maps

At the top of the entry point `src/app.js`:

```js
import "source-map-support/register";
```

`package.json`:

```json
"scripts": {
  "sorcery": "sorcery --input build/.es5 --output build/bundle",
}
```

## Automate the workflow

Dependencies:

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
    "clean": "rimraf build",
    "build": "npm-run-all --parallel lint:* --sequential tsc babel sorcery",
    "watch": "nodemon --watch src --ext ts,js --exec 'npm-run-all --sequential build start'"
  }
```

---

Finally, `package.json` looks like:

```json
  "scripts": {
    "clean": "rimraf build",
    "lint:ts": "tslint src/**/*.ts",
    "lint:js": "eslint src/**/*.js",
    "tsc": "tsc --rootDir src --sourceMap --outDir build/.es6",
    "babel": "babel build/.es6 --source-maps --out-dir build/.es5",
    "sorcery": "sorcery --input build/.es5 --output build/bundle",
    "start": "node build/bundle/app.js",
    "build": "npm-run-all --parallel lint:* --sequential tsc babel sorcery",
    "watch": "nodemon --watch src --ext ts,js --exec 'npm-run-all --sequential build start'"
  }
```
