# npm workflow for front-end and back-end development

[tslint](https://github.com/palantir/tslint) checks TypeScript code style:

```sh
npm install --save-dev tslint
```

[tsc](https://github.com/Microsoft/TypeScript) compiles TypeScript to ES5/ES6 JavaScript:
```sh
npm install --save-dev typescript
```

[babel-cli](https://github.com/babel/babel/tree/master/packages/babel-cli) (the Babel command-line tool) compiles ES6 to readable ES5 JavaScript:

```sh
npm install --save-dev babel-cli
npm install --save-dev babel-preset-es2015
npm install --save-dev babel-plugin-transform-runtime
```

[sorcery](https://github.com/Rich-Harris/sorcery) resolves a chain of sourcemaps:

```sh
npm install --save-dev sorcery
```

[npm-run-all](https://github.com/mysticatea/npm-run-all) runs multiple scripts in parallel or sequential:

```sh
npm install --save-dev npm-run-all
```

[nodemon](https://github.com/remy/nodemon) monitors for any changes (like `gulp.watch()`):

```sh
npm install --save-dev nodemon
```

[rimraf](https://github.com/isaacs/rimraf) is a cross-platform `rm -rf`:

```sh
npm install --save-dev rimraf
```

Then, the `package.json` looks like:

```json
 "scripts": {
    "clean": "rimraf build",
    "lint": "tslint src/**/*.ts",
    "tsc": "tsc --rootDir src --sourceMap --outDir build/es6",
    "babel": "babel build/es6 --source-maps --out-dir build/es5",
    "sorcery": "sorcery --input build/es5 --output build/bundle",
    "build": "npm-run-all --sequential lint tsc babel sorcery",
    "start": "node build/bundle/app.js",
    "watch": "nodemon --watch src --ext ts --exec 'npm-run-all --sequential build start'"
  },
```

[source-map-support](https://github.com/evanw/node-source-map-support) adds source map support for Node.js stack traces:

```sh
npm install --save source-map-support
```

and at the top of the entry point `src/app.js`:

```js
import "source-map-support/register";

...
```
