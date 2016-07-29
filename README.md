# ES2015 with npm (instead of Grunt/Gulp)

## Compilation

```sh
npm install --save-dev watch eslint babel-cli babel-preset-es2015
```

Add entry to `package.json`:

```json
"scripts": {
    "start": "node build/app.js",
    "clean": "rm -rf build",
    "eslint": "eslint src",
    "babel": "babel src --presets es2015 --source-maps -d build",
    "compile": "npm run clean && npm run eslint && npm run babel",
    "watch": "watch --interval=1 'npm run compile && npm run start' src"
},
```

## Source Map support

```sh
npm install --save source-map-support
```

Import this module below from the entry point `src/app.js`:

```js
import 'source-map-support/register';

...
```

and just run `npm run watch`.
