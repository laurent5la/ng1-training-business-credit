'use strict';

var fs = require('fs');
var gzippedAssetTypes = ['html', 'json', 'css', 'js', 'eot', 'svg', 'ttf', 'woff', 'woff2'];

var filePath = {
    build: {
        dist: './dist/',
        portal: './dist/portal/',
        archive: './archive'
    },
    lint: {
        src: [
            './gulpfile.js',
            './app/**/*.js',
            './app/*.js'
        ]
    },
    jscs: {
        src: 'app/**/*.js',
        dest: 'app'
    },
    test: {
        unit: {
            src: './app/**/*_unit-test.js'
        },
        e2e: {
            src: './app/{module}/*_e2e-test.js'
        },
        dest: './test/'
    },
    browserify: {
        src: './app/app.js'
    },
    styles: {
        src: ['./app/app.less'],
        watch: ['./app/app.less', './app/**/*.less'],
        dest: './dist/portal/css/'
    },
    static: {
        src: ['./app/assets/**/*', './app/index.html'],
        dest: './dist/portal/'
    },
    font: {
        src: ['./node_modules/cirrus-ux/fonts/*'],
        dest: './dist/portal/fonts/'
    },
    literals: {
        src : './literals.csv',
        dest : './dist/portal/languages'
    },
    localization: {
        src : './localization/*'
    },
    vendorJS: {
        dependencies: Object.keys(JSON.parse(fs.readFileSync('./package.json', 'utf8')).dependencies)
    },
    vendorCSS: {
        src: [
            './node_modules/cirrus-ux/less/_cirrus.less',
            './node_modules/angular-growl-v2/build/*.min.css',
            './node_modules/ui-select/dist/select.css',
            './node_modules/intro.js/introjs.css'
        ]
    },
    karma: {
        src: [
            '/test/*.js'
        ]
    },
    gzippedAssetTypes: gzippedAssetTypes,
    gzipGlob: '**/*.{' + gzippedAssetTypes.join(',') + '}'
};


module.exports = filePath;
