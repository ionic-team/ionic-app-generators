var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

/*var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });
*/
module.exports = {
  entry: './dist/compiled/index.js',
  target: 'node',
  output: {
    path: './dist/ionic-generators',
    filename: 'index.js'
  }
}