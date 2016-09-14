# ionic-app-generators
This project is a small library used for generating content types (page, component, directive, tabs, etc) within an Ionic project. This utility is included as a dependency to ionic-cli.

The project is written in typescript. It is then converted to ES5, and bundled with WebPack to result in a dependency free experience.

## To Build
Run `npm run build` to build the project. It builds an `index.js` and a `package.json` file to `dist/ionic-generators`.

## To Publish
Manually increment the package.json version in the `build` directory.  Do a build, and then navigate to the `dist/ionic-generators` directory and run `npm publish`.

Before publishing, please run the tests and make sure they pass.

## To Test
Unit tests - `npm run test`
E2E - `npm run e2e`
E2E for tabs - `npm run e2e`