require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { minify } = require("terser");
var fs = require('fs');
var passport = require('passport');

// Setup database environment
require('./app_api/models/db');
require('./app_api/config/passport');

// var routes = require('./app_server/routes/index');
var routesAPI = require('./app_api/routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

// Create minified angular app.
var appClientFiles = [
  path.join(__dirname, 'app_client','bloggerApp.js'),
  path.join(__dirname, 'app_client','bloggerApp.config.js'),
  path.join(__dirname, 'app_client','common','common.module.js'),
  path.join(__dirname, 'app_client','common', 'common.component.js'),
  path.join(__dirname, 'app_client','common', 'navigation', 'navigation.component.js'),
  path.join(__dirname, 'app_client','common', 'auth', 'auth.component.js'),
  // path.join(__dirname, 'app_client','common', 'auth', 'authentication.js'),
  path.join(__dirname, 'app_client','common', 'services', 'auth.service.js'),
  path.join(__dirname, 'app_client','common', 'services', 'bloggerData.service.js'),
  path.join(__dirname, 'app_client','pictionary', 'pictionary.module.js'),
  path.join(__dirname, 'app_client','pictionary', 'pictionary.component.js'),
  path.join(__dirname, 'app_client','blogger', 'blogger.module.js'),
  path.join(__dirname, 'app_client','blogger', 'blogger.component.js')
];

fs.writeFileSync(path.join(__dirname, 'public', 'angular', 'bloggerApp.min.js'), "");

appClientFiles.reverse();
while (appClientFiles.length) {
  var fpath = appClientFiles.pop();
  var fname = fpath.split(path.sep).pop();
  console.log(fname);
  var data = fs.readFileSync(fpath, 'utf-8').replace('\\r','').replace('\\n', '');
  fs.appendFileSync(path.join(__dirname, 'public', 'angular', 'bloggerApp.min.js'), data);
  // minify(data).
  //   then((value) => {
  //     console.log(value.code);
  //     fs.appendFileSync(path.join(__dirname, 'public', 'angular', 'bloggerApp.min.js'), value.code);
  //   },
  //   (reason) => console.log(reason));
}

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/jq', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(passport.initialize());

// app.use('/', routes);
app.use('/api', routesAPI);

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client' ,'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
