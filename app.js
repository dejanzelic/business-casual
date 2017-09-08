var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var contact = require('./routes/contact');
var cookieSet = require('./routes/cookieSet')
var app = express();

const puppeteer = require('puppeteer');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/contact', contact);
app.use('/eec15352ad13e6c33e21273bb93625f9535fd8d8e6d85b24bb8d3bda3cb027a6', cookieSet);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 1024, height: 768});
  await page.goto("http://127.0.0.1:8080/eec15352ad13e6c33e21273bb93625f9535fd8d8e6d85b24bb8d3bda3cb027a6");
  await page.screenshot({path: "screenshots/cookieSet.png"});

  browser.close();
})();

module.exports = app;
