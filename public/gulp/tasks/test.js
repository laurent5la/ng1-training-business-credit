'use strict';
var glob = require('glob');
var mkdirp = require('mkdirp');
var jsonlint = require('gulp-jsonlint');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('jshint-stylish');
var jscsStylish = require('gulp-jscs-stylish');
var gulp = require('gulp');
var Server = require('karma').Server;
var protractor = require('gulp-protractor').protractor;
var symlink = require('gulp-symlink');
var argv = require('yargs').argv;           // to read input CLI parameters
var path = require('path');
var runSequence = require('run-sequence');

var serverConf = require('../server-conf.json');
var localServer = require('../local-server');
var mockServer = require('../mock-server');
var filePath = require('../file-paths');
var utilities = require('../utilities');

gulp.task('hook', function () {
    return gulp.src('hooks/*')
        .pipe(symlink('.git/hooks/'));
});

gulp.task('jsonlint', function () {
    return gulp.src('./app/**/*.json')
        .pipe(jsonlint())
        .pipe(jsonlint.reporter())
        .pipe(jsonlint.failOnError());
});

gulp.task('lint', function () {
    return gulp.src(filePath.lint.src)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(utilities.errorReporter());
});

gulp.task('jscs', function () {
    var fix = argv.fix ? true : false;
    return gulp.src(filePath.jscs.src)
        .pipe(jscs({configPath: '.jscsrc', fix: fix}))
        .pipe(gulp.dest(filePath.jscs.dest))
        .on('error', function () {
            throw new Error('JSCS fail');
        })
        .pipe(jscsStylish());
});

gulp.task('karma', function (done) {
    if (argv.module) {
        runSequence('karma:single', done);
    }
    else {
        runSequence('karma:all', done);
    }
});

gulp.task('karma:all', ['locale:dev', 'version'], function (done) {
    new Server({
        configFile: path.resolve('karma.conf.js'),
        singleRun: true
    }, done).start();
});

gulp.task('karma:single', function (done) {
    new Server({
        configFile: path.resolve('karma-single.conf.js'),
        singleRun: true
    }, done).start();
});

gulp.task('generate-combined-report', function (done) {
    var basedir = './coverage/combined';
    var istanbul = require('istanbul'),
        collector = new istanbul.Collector(),
        reporter = new istanbul.Reporter(false, basedir),
        sync = false;

    mkdirp(basedir);

    glob.sync('./coverage/**/*coverage*.json').forEach(function (file) {
        collector.add(require(path.resolve(file)));
    }, this);

    reporter.addAll([ 'lcov' ]);
    reporter.write(collector, sync, function () {
        console.log('Combined reports generated');
        done();
    });
});

gulp.task('generate-protractor-report', function (done) {
    var istanbul = require('istanbul'),
        collector = new istanbul.Collector(),
        reporter = new istanbul.Reporter(false, './coverage/protractor'),
        sync = false;

    glob.sync('./coverage/protractor/coverage-*.json').forEach(function (file) {
        collector.add(require(path.resolve(file)));
    }, this);

    reporter.addAll([ 'lcov', 'clover' ]);
    reporter.write(collector, sync, function () {
        console.log('Protractor report generated');
        done();
    });
});

gulp.task('e2e', ['browserify:app:test'], function () {
    var localServerInstance = localServer();
    var mockServerInstance = mockServer();

    var configFile = 'protractor.' + process.platform + '.conf.js'; // 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'

    // when all e2e tests are in good state, revert to file glob for e2e
    // var path = filePath.test.e2e.src;

    // // expect {module} arg to be in the path. e.g. './app/{module}/*_e2e-test.js'
    // if (argv.module && typeof(argv.module) === typeof('string')) {
    //     path = path.replace('{module}', argv.module + '/**');
    // }
    // else {
    //     path = path.replace('{module}', '**');
    // }

    // for now just add working e2e tests to this array.
    var files = [
        './app/login/login-controller_e2e-test.js',
        './app/user/add/user-add-controller_e2e-test.js'
    ];

    return gulp.src(files)
        .pipe(protractor({
            configFile: configFile,
            args: ['--baseUrl', 'http://localhost:' + serverConf.port]
        }))
        .on('error', function (e) {
            throw e;
        })
        .on('end', function () {
            localServerInstance.close();
            mockServerInstance.close();
        });
});


gulp.task('test', [
    'port-scanner',
    'jsonlint',
    'lint',
    'jscs',
], function (done) {
    // run-sequence module will be obsolete when orchestrator supports non-dependent ordered tasks.
    // @SEE https://github.com/OverZealous/run-sequence#please-note
    runSequence('clean', 'compile:test', ['karma', 'e2e'], 'generate-protractor-report', 'generate-combined-report', done);
});
