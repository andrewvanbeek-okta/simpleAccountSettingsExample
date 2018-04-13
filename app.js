var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var BoxSDK = require('box-node-sdk');
const okta = require('@okta/okta-sdk-nodejs');



var oktaConfig = require('config.json')('./oktaconfig.json');
const client = new okta.Client({
  orgUrl: oktaConfig.oktaAppSettings.oktaUrl,
  token: oktaConfig.oktaAppSettings.apiToken    // Obtained from Developer Dashboard
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const session = require('express-session');

const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: oktaConfig.oktaAppSettings.oktaAuthorizationServer
})




var app = express();

app.use(session({
  secret: 'this should be secure',
  resave: true,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'))
app.get('/', (req, res) => {
  var token = req.query.token
  if(req.session.oktaSession){

    res.render('index')
  }
  oktaJwtVerifier.verifyAccessToken(token)
  .then(jwt => {
    console.log(jwt.claims.boxToken)
    var claims = jwt.claims
    var refreshToken = jwt.claims.boxToken
    console.log(jwt.claims.boxToken)
    var expressSession = req.session;
    expressSession.oktaSession = true;
    expressSession.username = claims.sub
    res.render('index')
  })
  .catch(err => {
    res.redirect('/login')
  });
})


app.get('/changePassword', (req, res) => {
  console.log("sioejifjsioefjiohsiohfi")

  var user = req.query.userId
  console.log(req.query)
  console.log("user")
  var request = require("request");
  console.log("here")
  var url = oktaConfig.oktaAppSettings.oktaUrl + '/api/v1/users/' + user + '/credentials/change_password'
  console.log(url)
  var options = { method: 'POST',
    url: url,
    headers:
     { 'Postman-Token': '301451a7-9c95-cdfe-a5a2-55a850a0917e',
       'Cache-Control': 'no-cache',
       Authorization: 'SSWS ' + oktaConfig.oktaAppSettings.apiToken,
       'Content-Type': 'application/json',
       Accept: 'application/json' },
    body:
     { oldPassword: { value: req.query.oldPassword },
       newPassword: { value: req.query.newPassword }
     },
    json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(error)
     res.end();
    console.log(body);
  });
   res.end();

})


app.get('/resetMfa', (req, res) => {
  console.log("sioejifjsioefjiohsiohfi")

  var user = req.query.userId
  console.log(req.query)
  console.log("user")
  var request = require("request");
  console.log("here")
  var url = oktaConfig.oktaAppSettings.oktaUrl + '/api/v1/users/' + user + '/lifecycle/reset_factors'
  console.log(url)
  var options = { method: 'POST',
    url: url,
    headers:
     { 'Postman-Token': '301451a7-9c95-cdfe-a5a2-55a850a0917e',
       'Cache-Control': 'no-cache',
       Authorization: 'SSWS ' + oktaConfig.oktaAppSettings.apiToken,
       'Content-Type': 'application/json',
       Accept: 'application/json' },
    body:
     {
     },
    json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(error)

    console.log(body);
     res.end();
  });
   res.end();

})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect("/login")
})


app.get('/login', (req, res) => {
  // res.redirect('https://localhost:9000')

  if(req.session.oktaSession){
    res.redirect('http://localhost:3000')
  } else {
    res.render('login')
  }
})

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
