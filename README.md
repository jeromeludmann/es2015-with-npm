# ES2015 (ES6) Development Workflows

## Compilation

 - **eslint**: ES5/ES6 pattern checker
 - **babel**: ES6 to readable ES5

```sh
npm install --save-dev eslint 
npm install --save-dev babel-cli babel-preset-es2015
```

Other useful libraries:

 - **rimraf**: cross-platform `rm -rf`.
 - **npm-run-all**: great tool to run npm tasks in parallel or sequential
 - **nodemon**: monitor script of a Node app

```sh
npm install --save-dev rimraf npm-run-all nodemon
```

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

## Source Map support

```sh
npm install --save source-map-support
```

Import this from the entry point `src/app.js`:

```js
import 'source-map-support/register';

...
```

Then run `npm run watch`.
