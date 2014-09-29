Stimpy Mobile
=============

[Stimpy](https://github.com/semateos/stimpy) is a simple yet inventive fellow.  This is a boilerplate for Hapi.js backed app that works on the web or as a nativized mobile app.  The idea is to build one application that works as well packaged as a native app as it does on the web.  We're not quite there yet, but getting close.  Contributors welcomed with open arms and buttocks.

To install Stimpy:
```bash
$ npm install -g stimpy supervisor bower gulp cordova
```
To start a new Stimpy Mobile project
```bash
$ stimpy create mobile my_new_project
$ cd my_new_project
```
Start the local testing server by running the command:
```bash
$ stimpy start
```
To test the ios build:
```bash
$ stimpy emulate ios
```

####To test on a real device, you'll want a live server.  We've provided a simple method for deploy your project to heroku (which has a free tier).  You'll need a [heroku login](https://signup.heroku.com/dc) and the [heroku toolbelt](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up).

To build a live test server:
```bash
$ stimpy deploy heroku
```

Edit `server/config/index.js` and replace the local api endpoint with the heroku server.

Open `cordova/platforms/ios/Stimpy Mobile.xcodeproj` in Xcode.

Run the project on the attached device following the Apple Developer proceedure for setting up a testing device.

=============

See: [https://devcenter.heroku.com/articles/getting-started-with-nodejs](https://devcenter.heroku.com/articles/getting-started-with-nodejs)

Running `gulp` from the command line will run the tasks in the `gulpfile.js`. The current tasks will minify and optimize your CSS, JS, and Images. If you want more tasks you can go to the Gulp Plugin page. [http://gratimax.github.io/search-gulp-plugins/](http://gratimax.github.io/search-gulp-plugins/)

## The Stack:
**Node.js** - Because it's fast, easy to get started, and Javscript is awesome.
[http://nodejs.org/](http://nodejs.org/)

**Supervisor** - To watch for file changes and restart the server during development [https://github.com/isaacs/node-supervisor](https://github.com/isaacs/node-supervisor).

**Hapi** - A very well designed server framework that is easy to understand, easy to create your own plugins, scales very well, cache options built in, and more.
[http://spumko.github.io/](http://spumko.github.io/)

**Swig** - It looks like HTML, it's very fast, great for template inheritance, and allows you to use HTML syntax with the server and with front-end client Javascript includes.
[http://paularmstrong.github.io/swig/](http://paularmstrong.github.io/swig/docs/#browser)

**Bower** - Package management for the front end.  Bower uses a flat dependency tree, requiring only one version for each package, reducing page load to a minimum. [http://bower.io/](http://bower.io/)

**CSS Framework** - None. Choose your own CSS preprocessor and CSS framework.

**Gulp** - A task runner for your assets, and can do a lot more. The performance is amazing and it is easy to get started. [http://gulpjs.com/](http://gulpjs.com/)  The main files of bower pacakges are automagically included in `server/config/assets.js`

## Plugins
The Hapi plugins that are being used.

#### Dogwater
Dogwater makes [Waterline ORM](https://github.com/balderdashy/waterline) available as a Hapi plugin.  Models exist in `server/models` and connection/adapter configurations live in `server/config/dogwater.js`. [https://github.com/devinivy/dogwater](https://github.com/devinivy/dogwater)

#### Hapi-Named-Routes
Added names to the routes. This allows you to have access to the path in the templates just by using the `path.nameofroute` variable. [https://github.com/poeticninja/hapi-named-routes](https://github.com/poeticninja/hapi-named-routes)

#### Hapi-Assets
Assets are in the `./server/config/assets.js` file, and your view layer has access based on the node environment. If you are in `development` (default) you might want to have individual files (js,css). If you are in `production` you would want the assets combined for user performance. [https://github.com/poeticninja/hapi-assets](https://github.com/poeticninja/hapi-assets)

#### Hapi-Cache Buster
Client/browser reloads new assets based on package.json version of your application. [https://github.com/poeticninja/hapi-cache-buster](https://github.com/poeticninja/hapi-cache-buster)

#### Folder Structure
There are two main folders in the stack. The "**public**" folder for front-end (client side) code, and "**server**" folder for server side code.  `index.js` defines the hapi plugin, `server.js` is a sample server using the plugin.

## Contributers

[Sam Mateosian](https://github.com/semateos)

Based on hapi-ninja from [Saul Maddox](https://github.com/poeticninja)
and, [sample-hapi-rest-api](https://github.com/agendor/sample-hapi-rest-api)


## Credits
Credit goes to all of the open source code that people have made available.

#### License

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
