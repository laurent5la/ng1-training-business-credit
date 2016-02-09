'use strict';
var gulp = require('gulp');
var livereload = require('livereload');
var serverConf = require('../server-conf.json');
var filePath = require('../file-paths');
var livereloadServer;
var argv = require('yargs').argv;           // to read input CLI parameters

var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');

gulp.task('watch', ['livereload', 'browserify:app:dev'], function () {
    // run lint whenver gulpfile.js change watch files for changes
    gulp.watch(['./app/**/lang-*.json'], ['locale-watch']);
    gulp.watch([
        './app/**/*.json',
        '!./app/locale-revision-manifest.json',
        '!./app/**/lang-*.json'
    ], ['js-watch']);
    gulp.watch(['./app/**/*.less'], ['style-watch']);
    gulp.watch(['./app/**/*.html', '!./app/index.html'], ['template-watch']);
    gulp.watch(filePath.static.src, ['static']);
    gulp.watch(['./app/**/*.js'], ['js-watch'])
        .on('change', function(event) {
            // only lint/jscs files that change
            return gulp.src(event.path)
                .pipe(jshint())
                .pipe(jscs({configPath: '.jscsrc'}))
                .on('error', function() {})
                .pipe(stylish.combineWithHintResults())   // combine with jshint results
                .pipe(jshint.reporter('jshint-stylish'));
        });
});

gulp.task('livereload', function() {
    if (argv.disablelr) {
        return;
    }
    livereloadServer = livereload.createServer(serverConf.livereload);
    console.log('Starting live reload server on port ' + serverConf.livereload.port);
});

var livereloadRefresh = function(){
    if (argv.disablelr) {
        return;
    }
    livereloadServer.refresh('');
};

gulp.task('js-watch', ['browserify:app'], livereloadRefresh);
gulp.task('locale-watch', ['browserify:app:dev'], livereloadRefresh);
gulp.task('style-watch', ['styles'], livereloadRefresh);
gulp.task('template-watch', ['browserify:app'], livereloadRefresh);
