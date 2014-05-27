#! /usr/bin/env node

var config = require('./config');
var gulp = require('gulp');
var myArgs = require('minimist')(process.argv);
var extend = require('node.extend');
var portscanner = require('portscanner');

var EXPRESS_PORT = 3000;
var LIVERELOAD_PORT = 35729;
var EXPRESS_ROOT = __dirname;



// Get config file
if (typeof myArgs.config != 'undefined') {
    config = require(myArgs.config);
}

function extendConfig(config) {
    config = extend({
        paths: [],
        extension: "html",
        extensions: []
    }, config);

    if (typeof myArgs.path != 'undefined') {
        if (myArgs.path.trim() == '.') {
            myArgs.path = '';
        }
        config.paths.push({'static': process.cwd() + '/' + myArgs.path});
    }

    config.extensions.push(config.extension);

    return config;
}


function getWatchPaths() {

    var watchurl = [];
    for (var i = 0; i < config.extensions.length; i++) {
        for (var j = 0; j < config.paths.length; j++) {
            for (var path in config.paths[j]) {
                if (config.paths[j].hasOwnProperty(path)) {
                    watchurl.push(config.paths[j][path] + '/**/*.' + config.extensions[i]);
                }
            }
        }
    }
    return watchurl;
}


function startExpress(paths) {

    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')());
    for (var i = 0; i < paths.length ; i++) {
        for (var path in paths[i]) {
            if (paths[i].hasOwnProperty(path)) {
                app.use('/' + path, express.static(paths[i][path]));
            }
        }
    }

    app.listen(EXPRESS_PORT);
}

var lr;
function startLivereload() {

    lr = require('tiny-lr')();
    lr.listen(LIVERELOAD_PORT);
}

function notifyLivereload(event) {
    // `gulp.watch()` events provide an absolute path
    // so we need to make it relative to the server root
   var fileName = require('path').relative(EXPRESS_ROOT, event.path);
    console.log('livereload: ' + fileName);

    lr.changed({
        body: {
            files: [fileName]
        }
    });
}

portscanner.findAPortNotInUse(LIVERELOAD_PORT, LIVERELOAD_PORT + 50, '127.0.0.1', function(error, port) {
    LIVERELOAD_PORT = port;

    portscanner.findAPortNotInUse(EXPRESS_PORT, EXPRESS_PORT + 50, '127.0.0.1', function(error, port) {
        EXPRESS_PORT = port;

        config = extendConfig(config);
        startExpress(config.paths);
        startLivereload();
        gulp.watch(getWatchPaths(), notifyLivereload);
        console.log('Server started on port: ' + EXPRESS_PORT + ' with livereload on port: ' + LIVERELOAD_PORT);
        console.log('Here are the directories you can explore and the directories linked');
        for (var j = 0; j < config.paths.length; j++) {
            for (var path in config.paths[j]) {
                if (config.paths[j].hasOwnProperty(path)) {
                    console.log('http://localhost:' + EXPRESS_PORT + '/' + path + ' -> ' + config.paths[j][path] );
                }
            }
        }

    });

});