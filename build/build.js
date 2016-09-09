

function clean() {
  var del = require('del');
  del.sync('dist/*');
}

function deleteCompiled() {
  var del = require('del');
  del.sync('dist/compiled');
}

function runTsc() {
  return new Promise(function(resolve, reject) {
    var exec = require('child_process').exec;
    exec('./node_modules/.bin/tsc -p .', function(err, stdout, stderr) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function customResolver() {
  return {
    resolveId(id) {
      if (id.startsWith('lodash')) {
        return process.cwd() + '/node_modules/lodash-es/' + id.split('lodash/').pop() + '.js';
      }
    }
  };
}

function bundle() {
  var rollup = require('rollup');
  var nodeResolve = require('rollup-plugin-node-resolve');
  var commonjs = require('@danbucholtz/rollup-commonjs-unambiguous-fork');

  return rollup.rollup({
        entry: './dist/compiled/index.js',
        sourceMap: true,
        plugins: [
          customResolver(),
          nodeResolve({
            module: true,
            jsnext: true,
            main: true
        }),
        commonjs({})
        ]
    }).then((bundle) => {
        return bundle.write({
            format: 'cjs',
            dest: './dist/ionic-generators/index.js'
        });
    });
}

function copyTemplates() {
  var promises = [];
  promises.push(copyFiles('./src/component/*', './dist/ionic-generators/component'));
  promises.push(copyFiles('./src/directive/*', './dist/ionic-generators/directive'));
  promises.push(copyFiles('./src/page/*', './dist/ionic-generators/page'));
  promises.push(copyFiles('./src/pipe/*', './dist/ionic-generators/pipe'));
  promises.push(copyFiles('./src/provider/*', './dist/ionic-generators/provider'));

  return Promise.all(promises);
}

function copyFiles(srcGlob, destDir) {
  return new Promise(function(resolve, reject) {
    var vinyl = require('vinyl-fs');
    var stream = vinyl.src(srcGlob).pipe(vinyl.dest(destDir));
    stream.on('end', function() {
      resolve();
    })
    stream.on('error', function() {
      reject();
    });
  });
}

function copyPackageJsonTemplate() {
  return copyFiles('./build/package.json', './dist/ionic-generators');
}

function doBuild() {
  clean()
  runTsc().then( function() {
    return bundle();
  }).then(function() {
    return copyTemplates();
  }).then(function() {
    return copyPackageJsonTemplate();
  }).then(function() {
    return deleteCompiled();
  }).catch(function(err){
    console.log("ERROR: ", err.message);
    process.exit(1);
  });
}

doBuild();