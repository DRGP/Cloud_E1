require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/autor', (req, res) => {
  res.json(
      { alumno: 'DG',
        servicio: 'Cloud Foundry en IBM Cloud' 
      }
      );
});

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY,
  }),
  serviceUrl: process.env.API_URL,
});


app.post('/toneAnalyzer', (req, res) => {
  const text = req.body.text;

  const toneParams = {
    toneInput: { 'text': text },
    contentType: 'application/json',
  };

  toneAnalyzer.tone(toneParams)
  .then(toneAnalysis => {
    res.json(toneAnalysis);
  })
  .catch(err => {
    res.json({error: true, message: err});
  });
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
