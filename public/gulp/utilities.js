'use strict';

var map = require('map-stream');
var exec = require('child_process').exec;

var errorReporter = function () {
    return map(function (file, cb) {
        if (!file.jshint.success) {
            process.exit(1);
        }
        cb(null, file);
    });
};

var gitCommitHash = function (cb) {
    exec('git log -1 --format=%H', function (err, stdout) {
        cb(stdout.trim());
    });
};

var gitCommitDate = function (cb) {
    exec('git log -1 --format=%ct', function (err, stdout) {
        cb(stdout.trim());
    });
};

var getVersion = function (cb) {
    gitCommitHash(function (hash) {
        gitCommitDate(function (date) {
            cb({
                service: 'dnbi-ui',
                version: hash,
                build: process.env.JOB_NAME || 'dev-build',
                written: new Date(parseInt(date + '000', 10))
            });
        });
    });
};

module.exports = {
    errorReporter: errorReporter,
    getVersion: getVersion
};
