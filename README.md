#static-livereload

livereload server for static file

#installation

It depends on gulp and livereload

``` js
$ npm install -g static-livereload
```

#utilisation

``` js
$ static-livereload --path test
Server started on port: 3000 with livereload on port: 35729
Here are the directories you can explore and the directories linked
http://localhost:3000/ -> /usr/local/lib/node_modules/static-livereload/public
http://localhost:3000/static -> /Users/farf/Workspace/test
```

Just go to the url shown and you can now edit files, it will update directly in your browser!

#configuration

You can inject a config file:

``` js
// config.js
module.exports = {
    paths: [{
        test: '/path/to/diretory/to/wath'
    }],
    extensions: ['html', 'css', 'js']
};
```

``` js
$ static-livereload --config /path/to/config/file
Server started on port: 3000 with livereload on port: 35729
Here are the directories you can explore and the directories linked
http://localhost:3000/ -> /usr/local/lib/node_modules/static-livereload/public
http://localhost:3000/test -> /path/to/diretory/to/wath
```