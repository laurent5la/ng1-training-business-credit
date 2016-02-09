'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var less = require('gulp-less');
var concat = require('gulp-concat');
var filePath = require('../file-paths');
var source = require('vinyl-source-stream');
var exorcist = require('exorcist');
var transform = require('vinyl-transform');
var ngAnnotate = require('browserify-ngannotate');
var autoPrefix = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var istanbul = require('browserify-istanbul');
var browserify = require('browserify');
var fs = require('fs');
var source = require('vinyl-source-stream');
var ngAnnotate = require('browserify-ngannotate');
var istanbul = require('browserify-istanbul');

var nonCommonJSDependencies = [
    'angular-file-upload/angular-file-upload',
    'angular-growl-v2/build/angular-growl',
    'angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files',
    'intro.js/intro'
];

var dependencies = filePath.vendorJS.dependencies;
dependencies.push.apply(dependencies, nonCommonJSDependencies);

gulp.task('browserify:app', ['version'], function () {
    return browserify({debug: true})
        .on('bundle', function () {
            dependencies.forEach(function (dependency) {
                this.external(dependency);
            }, this);
        })
        .add(filePath.browserify.src)
        .transform(ngAnnotate)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(transform(function () {
            return exorcist(filePath.build.portal + 'bundle.js.map');
        }))
        .pipe(gulp.dest(filePath.build.portal));
});

gulp.task('browserify:app:dev', function (done) {
    runSequence('locale:dev', 'version', 'browserify:app', done);
});

gulp.task('browserify:app:build', function (done) {
    runSequence('locale:build', 'version', 'browserify:app', done);
});

gulp.task('browserify:app:test', ['locale:dev', 'version'], function () {
    var coverageOptions = {
        ignore: ['node_modules/**', '**/*_unit-test.js', '**/*.html', '**/*.json']
    };
    return browserify({debug: true})
        .add(filePath.browserify.src)
        .transform(ngAnnotate)
        .transform(istanbul(coverageOptions))
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(filePath.build.portal));
});

gulp.task('browserify:vendor', function () {
    return browserify({debug: true})
        .on('bundle', function () {
            dependencies.forEach(function (dependency) {
                this.require(dependency);
            }, this);
        })
        .bundle()
        .pipe(source('vendor.js'))
        .pipe(transform(function () {
            return exorcist(filePath.build.portal + 'vendor.js.map');
        }))
        .pipe(gulp.dest(filePath.build.portal));
});

gulp.task('static', ['font'], function () {
    return gulp.src(filePath.static.src)
        .pipe(gulp.dest(filePath.static.dest));
});

gulp.task('font', function () {
    return gulp.src(filePath.font.src)
        .pipe(gulp.dest(filePath.font.dest));
});

gulp.task('styles', function () {
    return gulp.src(filePath.styles.src)
        .pipe(less({
            strictMath: true,
            paths: ['./node_modules'],  // Specify search paths for @import directives
            sourceMap: true,
            cleancss: false
        }))
        .pipe(autoPrefix(['last 2 version', 'ie 9']))
        .pipe(gulp.dest(filePath.styles.dest));
});

gulp.task('vendorCSS', function () {
    // Create vendor.css with 3rd party content
    return gulp.src(filePath.vendorCSS.src)
        .pipe(less({
            strictMath: true,
            sourceMap: true,
            cleancss: false
        }))
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(filePath.styles.dest));
});

gulp.task('locales', function () {
    return gulp.src(filePath.localization.src)
        .pipe(gulp.dest('dist/portal/angular/i18n/'));
});

gulp.task('compile:dev', [
    'hook',
    'browserify:app:dev',
    'browserify:vendor',
    'static',
    'styles',
    'vendorCSS',
    'locales',
    'validate-literals',
]);

gulp.task('compile:test', [
    'static',
    'styles',
    'vendorCSS',
]);

gulp.task('compile:build', [
    'browserify:app:build',
    'browserify:vendor',
    'static',
    'locales',
    'styles',
    'vendorCSS',
]);
