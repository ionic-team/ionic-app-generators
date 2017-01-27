

function clean() {
  var del = require('del');
  del.sync('dist/*');
}

function deleteCompiled() {
  // var del = require('del');
  // del.sync('dist/compiled');
}

function runTsc(testBuild) {
  return new Promise(function(resolve, reject) {
    var exec = require('child_process').exec;
    var command = './node_modules/.bin/tsc -p .';
    if (testBuild) {
      command = command + ' --module commonjs'
    }
    exec(command, function(err, stdout, stderr) {
      if (err) {
        console.log(stdout);
        console.log(stderr);
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

  /*var rollup = require('rollup');
  var nodeResolve = require('rollup-plugin-node-resolve');
  var commonjs = require('@danbucholtz/rollup-commonjs-unambiguous-fork');

  return rollup.rollup({
        entry: './dist/compiled/index.js',
        sourceMap: true,
        useStrict: false,
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
            useStrict: false,
            dest: './dist/ionic-generators/index.js'
        });
    });
    */
    return new Promise(function(resolve, reject) {
      var webpack = require('webpack');
      var config = require('./webpack.config');
      var compiler = webpack(config);
      compiler.run(function(err, stats) {
        if (err) {
            reject(err);
            return;
        }
        resolve();
      });
    });
}

function copyTypeDefinitions() {
  var destinationBase = './dist/ionic-generators';
  return copyFiles('./dist/compiled/*.d.ts', destinationBase);
}

function copyTemplates(isTestBuild) {
  var destinationBase = './dist/ionic-generators';
  if (isTestBuild) {
    destinationBase = './dist/compiled';
  }
  var promises = [];
  promises.push(copyFiles('./src/component/*', destinationBase + '/component'));
  promises.push(copyFiles('./src/directive/*', destinationBase + '/directive'));
  promises.push(copyFiles('./src/page/*', destinationBase + '/page'));
  promises.push(copyFiles('./src/pipe/*', destinationBase + '/pipe'));
  promises.push(copyFiles('./src/provider/*', destinationBase + '/provider'));

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

function doBuild(isTestBuild) {
  clean()
  runTsc(isTestBuild).then( function() {
    return bundle();
  }).then(function() {
    return copyTemplates(isTestBuild);
  }).then(function() {
    return copyPackageJsonTemplate();
  }).then(function() {
    return copyTypeDefinitions();
  }).then(function() {
    if (!isTestBuild) {
      return deleteCompiled();
    }
  }).catch(function(err){
    console.log("ERROR: ", err.message);
    process.exit(1);
  });
}

var isTestBuild = process.argv.length > 2 && process.argv[2] === '--test';

doBuild(isTestBuild);