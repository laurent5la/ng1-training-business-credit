'use strict';

var gulp = require('gulp');
var localServer = require('../local-server');
var mockServer = require('../mock-server');
var argv = require('yargs').argv;           // to read input CLI parameters

gulp.task('serve', ['port-scanner:local', 'watch', 'compile:dev'], function () {
    localServer();
});

gulp.task('serve-mock', ['port-scanner', 'watch', 'compile:dev'], function () {
    localServer();
    mockServer();
});

gulp.task('serve-prod', ['port-scanner:local', 'build'], function () {
    localServer(false);// if/when gzip is added back to build set to true
    if (argv.mock) {
        mockServer();
    }
});
