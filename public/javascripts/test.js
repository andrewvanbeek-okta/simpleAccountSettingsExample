const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
  orgUrl: 'https://vanbeektech.okta.com',
  token: '00YT-tc3t7VshtX5A6-i-XN9WyQD3mIHfhFei29RmK'    // Obtained from Developer Dashboard
});

//00u1r5knwoSpMubTC1t7

var oktaUser = client.getUser('andrew.vanbeek@vanbeektech.com')
.then(user => {
  var oktaUser = user
  oktaUser.profile.boxToken = 'bill';
  oktaUser.update().then(() => console.log('User nickname change has been saved'))
});
