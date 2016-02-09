'use strict';

var express = require('express');
var fs = require('fs');
var path = require('path');
var serverConf = require('./server-conf.json');
var argv = require('yargs').argv;           // to read input CLI parameters

var mockEndpoint = function (app, method, filePath, prefix) {
    var endpoint = filePath.substring(0, filePath.length - method.length - 1);
    if (endpoint.indexOf('/index') === endpoint.length - 6) {
        endpoint = endpoint.substring(0, endpoint.length - 6);
    }

    if (method === 'get') {
        app.get(endpoint, require(prefix + filePath));
    } else if (method === 'post') {
        app.post(endpoint, require(prefix + filePath));
    } else if (method === 'put') {
        app.put(endpoint, require(prefix + filePath));
    } else if (method === 'delete') {
        app.delete(endpoint, require(prefix + filePath));
    } else {
        return;
    }
};

var mock = function (app, prefix, path) {
    var stats = fs.statSync(prefix + path);

    if (!stats) {
        console.error('Error happened while mocking ' + prefix + path);
        console.error('Aborting the mock ....');
        return;
    }

    if (stats.isDirectory()) {
        var files = fs.readdirSync(prefix + path);
        var indx;
        for (indx in files) {
            mock(app, prefix, path + '/' + files[indx]);
        }

        if (path.length > 0) {
            app.all(path + '/*', function (req, res) {
                //404 for what's not there but we have the directory.
                res.status(404).send('not-found');
            });

            //console.log('Mocking path ' + path + '/* to directory:' + prefix + path); //comment back in to show folders mocked
        }
    } else if (stats.isFile()) {
        if (path.indexOf('.get.js') === path.length - 7) {
            mockEndpoint(app, 'get', path.substring(0, path.length - 3), prefix);
        } else if (path.indexOf('.post.js') === path.length - 8) {
            mockEndpoint(app, 'post', path.substring(0, path.length - 3), prefix);
        } else if (path.indexOf('.put.js') === path.length - 7) {
            mockEndpoint(app, 'put', path.substring(0, path.length - 3), prefix);
        } else if (path.indexOf('.delete.js') === path.length - 10) {
            mockEndpoint(app, 'delete', path.substring(0, path.length - 3), prefix);
        }
    }
};

// Checks for authentication cookie. If one doesn't exist, returns a 401 error.
function isAuthenticated(req, res) {
    if (!('com.dnb.cic.user.mock.token' in req.cookies)) {
        res.status(401).end();
        return false;
    } else {
        return true;
    }
}

var mockServer = function () {
    var app = express();
    var http = require('http');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var delay;

    var server;

    app.use(cookieParser());  // to support reading cookies. This must be before any isAuthenticated() call.

    // AUTHENTICATION MIDDLEWARE -

    // specify which endpoint should skip authentication check
    var endpoints = JSON.parse(fs.readFileSync('./app/common/endpoints.json', 'utf8'));
    var excludeFromAuth = [
        endpoints.authentication.login
    ];

    if (argv.delay) {
        delay = typeof argv.delay === 'boolean' ? 8000 : argv.delay;
        console.log('Adding delay of ' + delay + 'ms');
        app.use(function(req, res, next){setTimeout(next, delay);});
    }

    // Check that the user is authenticated for all services, except in exclude array
    app.use('/services', function (req, res, next) {
        if (excludeFromAuth.indexOf('/services' + req.path) >= 0 || isAuthenticated(req, res)) {
            next();
        }
    });

    app.use(bodyParser.json());                         // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({extended: false}));  // to support URL-encoded bodies

    //mock endpoints
    serverConf.mock.map(function (item) {
        var pathname = path.resolve(item);
        console.log('Mocking local files from ' + pathname);
        mock(app, pathname, '');
    });

    server = http.createServer(app).listen(8080, function () {
        console.log('Serving mock server at http://localhost:8080');
    });

    server.on('error', function (e) {
        if (e.code === 'EADDRINUSE') {
            console.log('Port 8080 is taken by another application... Did you mean to run "gulp serve"');
        }
        throw new Error(e);
    });
    return server;
};

module.exports = mockServer;
