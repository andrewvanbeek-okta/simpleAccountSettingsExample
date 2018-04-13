# simpleAccountSettingsExample

install express 

https://expressjs.com/en/starter/installing.html


Go to Okta and create an openid application with the redirecUri Value of http://localhost:3000, and check all the values of implict, client credentials, and refresh
(go to apps create application and select openid).  Make sure to assign app to everyone

Go to Okta and create an Authorization Server.  Once created take the issuer value

https://developer.okta.com/authentication-guide/implementing-authentication/set-up-authz-server

Also generate an okta api token by going to security > API > tokens

Copy the values and populate the oktaconfig.json with the corresponding values.

On the frontend just go to public/javascripts/okta.js and put in your okta values.

Now just npm install in the command line

and the npm start

With that you should be all set!
