'use strict';

var gulp = require('gulp');
var filePath = require('../file-paths');
var gextend = require('gulp-extend');
var wrapper = require('gulp-wrapper');
var jsonTransform = require('gulp-json-transform');
var rename = require('gulp-rename');
var csv2json = require('gulp-csv2json');
var rev = require('gulp-rev');
var supportedLocales = require('../../app/supported-locales.json');
var mergeStream = require('merge-stream');
var migrateTranslation = require('../migrate-translations');
var buildEnv = process.env.JOB_NAME || 'dnbi-ui_stg';
var localeDependencies = buildEnv === 'dnbi-ui_stg' ? ['fill-in-missing-translations'] : ['migrate-translations'];

// lang-en-us.json files are the source of truth for all translate IDs
// literals.csv is the provided version of translated strings

// revision and save revision manifest to './app/locale-revision-manifest.json'
function revisionStream() {
    return gulp.src(filePath.literals.dest + '/*.json')
        .pipe(rev())
        .pipe(gulp.dest(filePath.literals.dest))
        .pipe(rev.manifest('locale-revision-manifest.json'))
        .pipe(gulp.dest('./app'));
}

function createLocaleStream(locale) {
    return gulp.src(filePath.literals.src)
        .pipe(csv2json({
            delimiter: ',', //Set the field delimiter. One character only
            relax: true,  // Preserve quotes inside unquoted field.
            'skip_empty_lines': true, //Dont generate empty values for empty lines.
            trim: true //If true, ignore whitespace immediately around the delimiter, defaults to false. Does not remove whitespace in a quoted field.
        }))
        .pipe(jsonTransform(function (csvData) {
            var localeJSONMap = {};
            csvData.map(function (row) {
                localeJSONMap[row.key] = row[locale];
            });
            return localeJSONMap;
        }))
        .pipe(rename({basename: 'locale-' + locale, extname: '.json'}))
        .pipe(gulp.dest(filePath.literals.dest));
}

gulp.task('locale:build', ['generate-locale-files'], revisionStream);

gulp.task('locale:dev', ['generate-other-locale-files', 'generate-en-us-locale-file'], revisionStream);

gulp.task('generate-en-us-locale-file', ['clean:locale'], function () {
    return gulp.src('./app/**/lang-en-us.json')
        .pipe(gextend('locale-en-us.json'))
        .pipe(gulp.dest(filePath.build.portal + 'languages/'));
});

gulp.task('generate-locale-files', localeDependencies, function () {
    return mergeStream.apply(null, supportedLocales.map(function (locale) {
        return createLocaleStream(locale.id.toLowerCase());
    }));
});

gulp.task('generate-other-locale-files', ['clean:locale'], function () {
    return mergeStream.apply(null, supportedLocales.filter(function (locale) {
        return locale.id !== 'en-US';
    }).map(function (locale) {
        return createLocaleStream(locale.id.toLowerCase());
    }));
});

gulp.task('validate-csv', migrateTranslation.validateCSV);

// take new keys from lang-en-us.json files and add to literals.csv
// also remove unused keys
gulp.task('migrate-translations', migrateTranslation.syncCSV);
gulp.task('fill-in-missing-translations', migrateTranslation.fillInCSV);

// Check for duplicated translation keys.
// System will display when a duplicated key is found. (Currently, it doesn't show where the other duplicates are located)
gulp.task('validate-literals', function () {
    var uniqueLangList = {};
    // takes a string that matches all files that ends in locale-en.json in the app folder and creates a stream of objects representing those files
    return gulp.src('./app/**/lang-en-us.json')
        // display the filename in a json object
        .pipe(wrapper({
            header: '{ "${filename}":\n',
            footer: '}'
        }))
        .pipe(gextend('locale-validator.json'))
        // go through each of langfile
        .pipe(jsonTransform(function (langFile) {

            for (var file in langFile) {
                // shows the translation keys and pairs for each file
                var langValues = langFile[file];

                // convert to uppercase
                for (var langKey in langValues) {
                    var langKeyUpperCase = langKey.toUpperCase();
                    if (!uniqueLangList[langKeyUpperCase]) {
                        uniqueLangList[langKeyUpperCase] = langValues[langKey];
                    } else {
                        console.warn('Warning: Duplicate translation key found in ' + file + ' for key \'' + langKey + '\'.');
                    }
                }
            }

            return langFile;
        }));
});
