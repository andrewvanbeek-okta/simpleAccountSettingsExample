console.log("render")
var signIn = new OktaSignIn({
  baseUrl: "https://vanbeektech.okta.com",
  clientId: '0oa5yufppkMdPl6fN1t7',
  redirectUri: 'http://localhost:3000',
  authParams: {
issuer: "https://vanbeektech.okta.com/oauth2/aus60d8d47bCkliNc1t7",
  responseType: ['id_token', 'token'],

  scopes: ['openid', 'email']
},
features: {registration: true},
idps: [
  {type: 'GOOGLE', id: '0oa4prxm32LWwm1D91t7'}
]
});


var authClient = new OktaAuth({
    url: 'https://vanbeektech.okta.com',
    clientId: '0oa5yufppkMdPl6fN1t7',
    redirectUri: 'http://localhost:3000'
});

signIn.renderEl({el: '#okta'}, function (res) {
  if (res.status !== 'SUCCESS') {
    return;
  }
console.log(res)
  // When specifying authParams.responseType as 'id_token' or 'token', the
  // response is the token itself
  signIn.tokenManager.add('my_access_token', res[1]);
  signIn.tokenManager.add('my_id_token', res[0]);
  window.location.href = "http://localhost:3000?token=" + res[1].accessToken
});



//
//
// console.log("render")
// var mfaConfirm = new OktaSignIn({
//   baseUrl: "https://vanbeektech.okta.com",
//   clientId: '0oa5yufppkMdPl6fN1t7',
//   redirectUri: 'http://localhost:3000',
//   authParams: {
// issuer: "https://vanbeektech.okta.com/oauth2/aus60d8d47bCkliNc1t7",
//   responseType: ['id_token', 'token'],
//
//   scopes: ['openid', 'email']
// }
//
// });
//
//
// mfaConfirm.renderEl({el: '#oktaMFA'}, function (res) {
//   if (res.status !== 'SUCCESS') {
//     return;
//   }
// console.log(res)
//   signIn.tokenManager.add('my_access_token', res[1]);
//   signIn.tokenManager.add('my_id_token', res[0]);
//   window.location.href = "http://localhost:3000?token=" + res[1].accessToken
// });
