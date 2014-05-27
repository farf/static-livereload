#! /usr/bin/env node

var config = require('./config');
var gulp = require('gulp');
var myArgs = require('minimist');
var extend = require('node.extend');

var EXPRESS_PORT = 1111;
var EXPRESS_ROOT = __dirname;
var LIVERELOAD_PORT = 35729;

// Get config file
console.log(myArgs);
if (typeof myArgs.config != 'undefined') {
    console.log(myArgs.config);
    config = require(myArgs.config);
}

function extendConfig(config) {
    config = extend({
        path: __dirname + '/public',
        paths: [],
        extension: "js",
        extensions: []
    }, config);
    config.paths.push({'static': config.path});
    config.extensions.push(config.extension);

    return config;
}


function getWatchPaths() {

    var watchurl = [];
    console.log('Hello');
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

config = extendConfig(config);
startExpress(config.paths);
startLivereload();
gulp.watch(getWatchPaths(), notifyLivereload);
console.log('Server started on port: ' + EXPRESS_PORT + ' with livereload on port: ' + 35729);