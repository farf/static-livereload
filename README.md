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

Using livereload.js
-------------------

This script is meant to be included into the web pages you want to monitor, like this:

    <script src="http://localhost:35729/livereload.js"></script>

LiveReload 2 server listens on port `35729` and serves livereload.js over HTTP (besides speaking the web socket protocol on the same port).

A slightly smarter way is to use the host name of the current page, assuming that it is being served from the same computer. This approach enables LiveReload when viewing the web page from other devices on the network:

```html
<script>document.write('<script src="http://'
    + location.host.split(':')[0]
    + ':35729/livereload.js"></'
    + 'script>')</script>
```


However, since `location.host` is empty for `file:` URLs, we need to account for that:

```html
<script>document.write('<script src="http://'
    + (location.host || 'localhost').split(':')[0]
    + ':35729/livereload.js"></'
    + 'script>')</script>
```


LiveReload.js finds a `script` tag that includes `…/livereload.js` and uses it to determine the hostname/port to connect to. It also understands some options from the query string: `host`, `port`, `snipver`, `mindelay` and `maxdelay`.

`snipver` specifies a version of the snippet, so that we can warn when the snippet needs to be updated. The currently recommended `snipver` is version 1:

```html
<script>document.write('<script src="http://'
    + (location.host || 'localhost').split(':')[0]
    + ':35729/livereload.js?snipver=1"></'
    + 'script>')</script>
```


Additionally, you might want to specify `mindelay` and `maxdelay`, which is minimum and maximum reconnection delay in milliseconds (defaulting to `1000` and `60000`).

Alternatively, instead of loading livereload.js from the LiveReload server, you might want to include it from a different URL. In this case, add a `host` parameter to override the host name. For example:

```html
<script src="https://github.com/livereload/livereload-js/raw/master/dist/livereload.js?host=localhost"></script>
```
