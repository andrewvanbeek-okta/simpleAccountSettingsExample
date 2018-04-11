var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var BoxSDK = require('box-node-sdk');
const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
  orgUrl: 'https://vanbeektech.okta.com',
  token: '00YT-tc3t7VshtX5A6-i-XN9WyQD3mIHfhFei29RmK'    // Obtained from Developer Dashboard
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const session = require('express-session');

const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://vanbeektech.okta.com/oauth2/aus60d8d47bCkliNc1t7'
})

var config = require('config.json')('./boxoktaconfig.json');
var sdk = new BoxSDK({
	clientID: 'j2b4bfion13s0r4ubby6b54njylwbnj7',
	clientSecret: 'YBSN5RV2BGMrHRHcXjnDSsMuVkpO05I2',
	appAuth: {
		keyID: config.boxAppSettings.appAuth.publicKeyID,
		privateKey: config.boxAppSettings.appAuth.privateKey,
		passphrase: config.boxAppSettings.appAuth.passphrase
	}
});

var serviceAccountClient = sdk.getAppAuthClient('enterprise', config.enterpriseID);


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

    if(refreshToken != undefined){
      res.redirect("/portal?refresh=" + refreshToken)
    } else {
      res.redirect("https://account.box.com/api/oauth2/authorize?response_type=code&client_id=j2b4bfion13s0r4ubby6b54njylwbnj7&redirect_uri=http://localhost:3000/saml&state=security_token%3DKnhMJatFipTAnM0nHlZA")
    }

  })
  .catch(err => {
    res.redirect('/login')
  });
})


//if user has already authorized
app.get('/portal', (req, res) => {
  if(!req.session.oktaSession){

    res.redirect("/")
  }
  console.log("ya yea ya yaya")
  console.log(req.query)

  var request = require("request");

var options = { method: 'POST',
  url: 'https://api.box.com/oauth2/token',
  headers:
   { 'Postman-Token': '14083be2-b23d-ae62-19d5-5c31ae9dbfa8',
     'Cache-Control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData:
   { grant_type: 'refresh_token',
     refresh_token: req.query.refresh,
     client_id: 'j2b4bfion13s0r4ubby6b54njylwbnj7',
     client_secret: 'YBSN5RV2BGMrHRHcXjnDSsMuVkpO05I2' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(body);
  var boxTokenResponse = JSON.parse(body)
  var token = boxTokenResponse.access_token
  console.log(token)
  console.log(token == undefined)
  if(token == undefined){
    console.log('yeah')
    res.redirect("https://account.box.com/api/oauth2/authorize?response_type=code&client_id=j2b4bfion13s0r4ubby6b54njylwbnj7&redirect_uri=http://localhost:3000/saml&state=security_token%3DKnhMJatFipTAnM0nHlZA")
  } else {
    updateOktaUser(req.session.username, boxTokenResponse.refresh_token, token, res)
  }

});



})


var updateOktaUser = function(username, refreshToken, token, expressRes) {
console.log(username + "!!!!!")
if(!expressRes.cookie.user && !expressRes.cookie.token){
  expressRes.cookie('user', username, {maxAge: 108000})
    var oktaUser = client.getUser(username)
    .then(user => {
      var oktaUser = user
      oktaUser.profile.boxToken = refreshToken;
      oktaUser.update().then(() => expressRes.cookie('token', token, {maxAge: 108000})).then(() => expressRes.redirect("/"))

      console.log('User nickname change has been saved');
    });
}
}




app.get('/saml', (req, res) => {

  if(!req.session.oktaSession){

    res.redirect("/")
  }
  var request = require("request");
  console.log("yabo")
console.log(req.query)
var options = { method: 'POST',
  url: 'https://api.box.com/oauth2/token',
  headers:
   { 'Postman-Token': '12507362-1057-e742-3855-372ca7b880af',
     'Cache-Control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData:
   { grant_type: 'authorization_code',
     code: req.query.code,
     client_id: 'j2b4bfion13s0r4ubby6b54njylwbnj7',
     client_secret: 'YBSN5RV2BGMrHRHcXjnDSsMuVkpO05I2' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log("here")
  console.log(body);
    var boxTokenResponse = JSON.parse(body)
    var token = boxTokenResponse.access_token
    console.log(token)
    updateOktaUser(req.session.username, boxTokenResponse.refresh_token, token, res)







    //res.render('index', {test: token})
});

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
