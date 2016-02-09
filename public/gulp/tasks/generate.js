'use strict';

var gulp = require('gulp');
var args = require('yargs').argv;
var path = require('path');
var template = require('gulp-template');
var rename = require('gulp-rename');

function cap(val) {
    return val.charAt(0).toUpperCase() + val.slice(1);
};

function toDash(string) {
    return string.replace(/([A-Z])/g, function($1){ return '-' + $1.toLowerCase();});
}

function camelCase(string) {
    return string.replace( /-([a-z])/ig, function( all, letter ) {
        return letter.toUpperCase();
    });
}

gulp.task('generate', [], function (done) {
    var basedir = path.resolve(__dirname, '../..');
    var camelCaseName = camelCase(args.name);
    var dashedName = toDash(args.name);
    var parent = args.parent || '';
    var type = args.type;
    var newFolder = type !== 'directive' && type !== 'filter';
    var destPath = path.join(basedir, 'app', parent, newFolder ? dashedName : '');
    var templates = path.join(basedir, 'generator', type + '/**');

    console.log('Generating: ' + camelCaseName, '\nType: ' + type, '\nDestination path: ' + destPath, '\nTemplate source: ' + templates);

    return gulp.src(templates)
        .pipe(template({
            camelCaseName: camelCaseName,
            upCaseName: cap(camelCaseName),
            dashedName: dashedName
        }))
        .pipe(rename(function(path){
            path.basename = path.basename.replace('generator', dashedName);
        }))
        .pipe(gulp.dest(destPath));

});

