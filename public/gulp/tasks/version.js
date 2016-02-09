'use strict';

var gulp = require('gulp');
var fs = require('fs');
var utilities = require('../utilities');

gulp.task('version', function (cb) {
    utilities.getVersion(function (version) {
        fs.writeFile('app/about/client-version.json', JSON.stringify(version));
        cb();
    });
});

