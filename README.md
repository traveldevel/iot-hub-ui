# iot-hub-ui

login page ref : 

http://www.techippo.com/2016/11/responsive-sapui5-login-page-custom.html

https://stackoverflow.com/questions/37474958/creation-of-login-page-along-with-authentication-sapui5-by-storing-data-in-json

# Source Template steps

1. Clone : https://github.com/SAP/openui5-basic-template-app

2. `npm install grunt-cli bower -g`

3. `npm install`

4. `bower install`

5. Start local server `grunt` or `grunt --force`

6. Open : [http://localhost:8080](http://localhost:8080)

7. Copy `manifest.yml` to `dist` folder and change directory `cd dist`. 

8. Run `cf push` (after `cf api`, `cf login`...)