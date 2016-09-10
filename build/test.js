

function runTests() {
  var vinyl = require('vinyl-fs');
  var jasmine = require('gulp-jasmine');
  vinyl.src('./dist/compiled/*.spec.js').pipe(jasmine());
}

runTests();