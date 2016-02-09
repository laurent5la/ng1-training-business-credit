'use strict';

var express = require('express');
var filePaths = require('./file-paths');
var serverConf = require('./server-conf.json');
var argv = require('yargs').argv;           // to read input CLI parameters
var extend = require('extend');
var path = require('path');

var settings;
var servicesProxy;

function setProxySettings() {
    var defaultSettings = {
        clean: false,
        mode: 'proxy',
    };

    var externalHost = argv.to || 'dnbi-cirrus-qa.malibucoding.com';
    var host = argv.proxy ? externalHost : 'localhost';

    settings = extend(defaultSettings, {
        servicesHost: host,
        clean: argv.clean,
        mode: argv.mode,
        port: argv.proxy ? 443 : 8080,
        secure: argv.proxy ? true : false,
    });
}

function readCookie(cookie, prop) {
    var regex = new RegExp(prop + '=([^;]*)');
    var result = regex.exec(cookie);
    return result && result.length ? result[0] : null;
}

function onServicesProxyCreated(proxy) {
    servicesProxy = proxy;
    proxy.on('proxyRes', function(proxyRes) {
        if (proxyRes.headers && proxyRes.headers['set-cookie']) {
            proxyRes.headers['set-cookie'].forEach(function (value, key) {
                // Parse cookie and strip domain property to an empty string and remove Secure property
                var domain = readCookie(this[key], 'Domain');
                this[key] = value.replace(domain, '').replace('Secure;', '');
            }, proxyRes.headers['set-cookie']);
        }
    });
}

function setEncodingHeader(req, res, next) {
    var path = require('path');
    var isServices = req.url.indexOf('/services/') !== -1;
    var extension = path.extname(req.url).substring(1);
    var html5Path = !isServices && !extension;
    var isGzipped;
    filePaths.gzippedAssetTypes.forEach(function (fileExtension) {
        // some files dont match one to one to extensions, do a contains
        if (extension.indexOf(fileExtension) !== -1) {
            isGzipped = true;
        }
    });
    if (isGzipped || html5Path) {
        res.setHeader('Content-Encoding', 'gzip');
    }
    next();
}

function initPrismProxy() {
    var prism = require('connect-prism');

    prism.create({
        name: 'services',
        mode: settings.mode,
        context: '/services',
        port: settings.port,
        host: settings.servicesHost,
        https: settings.secure,
        clearOnStart: settings.clean,
        proxyConfig: {
            options: {
                secure: settings.secure
            },
            onProxyCreated: onServicesProxyCreated
        }
    });
    return prism;
}

var localServer = function (assetsGzipped) {
    setProxySettings();
    var app = express();
    var http = require('http');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var prism = initPrismProxy();
    var server;

    if (assetsGzipped) {
        app.use(setEncodingHeader);
    }

    app.use(prism.middleware);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));  // to support URL-encoded bodies
    app.use(cookieParser());  // to support reading cookies. This must be before any isAuthenticated() call.

    app.use(express.static('./dist/portal'));

    app.get('/report.pdf', function (req, res) {
        var report = path.resolve(__dirname + '/../report.pdf');
        res.sendFile(report);
    });

    // any other paths are considered html5 paths and should load index.html
    app.get('*', function (req, res) {
        var indexPath = path.resolve(__dirname + '/../dist/portal/index.html');
        res.sendFile(indexPath);
    });

    server = http.createServer(app).listen(serverConf.port, function () {
        console.log('Serving UI at http://localhost:' + serverConf.port);
    });

    server.on('error', function (e) {
        if (e.code === 'EADDRINUSE') {
            console.log('Port is taken by another application...');
        }
        throw new Error(e);
    });

    server.on('close', function () {
        servicesProxy.close();
    });

    return server;
};

module.exports = localServer;
