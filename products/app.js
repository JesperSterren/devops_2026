var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { initializePrometheus, requestMetrics } = require('./services/metrics');

var indexRouter = require('./routes/index');
var productsRouter = require('./routes/products');

var app = express();

// Initialize Prometheus metrics
initializePrometheus(app);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for metrics
app.use(requestMetrics);

app.use('/', indexRouter);
app.use('/products', productsRouter);

// Error handling
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
