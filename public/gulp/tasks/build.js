'use strict';

var gulp = require('gulp');
var filePath = require('../file-paths');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var gzip = require('gulp-gzip');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var runSequence = require('run-sequence');
var del = require('del');
var removeCode = require('gulp-remove-code');

var portal = filePath.build.portal;

gulp.task('uglify-js', function () {
    return gulp.src(filePath.build.portal + '**/*.js')
        .pipe(uglify({
            mangle: true,
            compress: {
                loops: true,
                //warnings: true,
                /*jshint camelcase: false */
                'join_vars': true
            }
        }))
        .pipe(gulp.dest(filePath.build.portal));
});

gulp.task('remove-livereload-snippet', function () {
    return gulp.src('./dist/portal/index.html')
        .pipe(removeCode({ production: true }))
        .pipe(gulp.dest('./dist/portal'));
});

gulp.task('minify-css', function () {
    return gulp.src(filePath.build.portal + '**/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest(filePath.build.portal));
});

gulp.task('revision', function () {

    var src = [
        portal + '**/*.*',
        '!' + portal + 'index.html',
        '!' + portal + 'angular/i18n/*',
        '!' + portal + 'languages/*.json' // revisioned at an earlier point
    ];

    return gulp.src(src, {base: portal})
        .pipe(rev())
        .pipe(gulp.dest(portal))
        .pipe(rev.manifest())
        .pipe(gulp.dest(portal));
});

function deleteRevisionSources() {
    var path = require('path');
    var _ = require('lodash');
    var manifestjson = require(path.resolve(portal + 'rev-manifest.json'));
    var languageManifestjson = require(path.resolve('./app/locale-revision-manifest.json'));
    _.extend(manifestjson, languageManifestjson);
    var filesToDelete = Object.keys(manifestjson).map(function (file) {
        if (file.indexOf('lang') !== -1) {
            return portal + 'languages/' + file;
        }
        return portal + file;
    });
    del.sync(filesToDelete);
}

gulp.task('rev-replace', ['revision'], function () {

    var filesToReplaceRevvedNames = [
        portal + '/index.html',
        portal + '/**/app*.css',
        portal + '/**/bundle*.js',
    ];

    deleteRevisionSources();

    var manifest = gulp.src(portal + '/rev-manifest.json');
    return gulp.src(filesToReplaceRevvedNames)
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest(portal));
});

gulp.task('gzip-resources', function () {
    return gulp.src(filePath.build.portal + filePath.gzipGlob)
        .pipe(gzip({}))
        .pipe(rename({
            extname: '' //overwrite the current file (don't add .gz add the end)
        }))
        .pipe(gulp.dest(filePath.build.portal));
});

// this is a bit of a hack, but we need to clean up the files that are now renamed
// should prefer streaming all transforms
gulp.task('tidy-up', function (cb) {
    var thingsToDelete = [
        portal + 'rev-manifest.json',
        portal + 'bundle*map',
        portal + 'vendor*map',
        portal + 'fonts/selection*.json',
    ];
    del(thingsToDelete, cb);
});

// run-sequence module will be obsolete when orchestrator supports non-dependent ordered tasks.
// @SEE https://github.com/OverZealous/run-sequence#please-note for
gulp.task('build', function(callback) {
    runSequence('clean', 'compile:build', ['remove-livereload-snippet', 'uglify-js', 'minify-css'], 'rev-replace', 'tidy-up', callback);
});
