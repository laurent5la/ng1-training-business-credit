'use strict';

var gulp = require('gulp');

gulp.task('port-scanner:mock', function (done) {
    var portscanner = require('portscanner');
    portscanner.checkPortStatus(8081, '127.0.0.1', function (err, status) {
        if (status === 'open') {
            throw new Error('Port 8080 in use');
        }
        done();
    });
});

gulp.task('port-scanner:local', function (done) {
    var portscanner = require('portscanner');
    portscanner.checkPortStatus(9090, '127.0.0.1', function (err, status) {
        if (status === 'open') {
            throw new Error('Port 9090 in use');
        }
        done();
    });
});

gulp.task('port-scanner', ['port-scanner:mock', 'port-scanner:local']);
