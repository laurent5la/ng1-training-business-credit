'use strict';

var gulp = require('gulp');
var del = require('del');
var filePath = require('../file-paths');

gulp.task('clean', function (cb) {
    del(['dist/', 'test/', 'coverage/'], cb);
});

gulp.task('clean:locale', function (cb) {
    del([filePath.literals.dest, './app/locale-revision-manifest.json'], cb);
});
