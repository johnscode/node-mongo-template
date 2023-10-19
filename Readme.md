# node-mongo-template

This is a simple webapp using express.js and MongoDb and having websocket
capability. The front-end is built using a simple bootstrap template and jquery.

It is intended as a template for projects that don't require complex ui. It that has 
been very useful to me for getting small projects up quickly.

The web app demonstrates a simple chat client.

# Setup

## node install

tested with tool versions on osx:
nvm 0.39.2
node v18.12.0
npm 9.6.6

### install web app
Clone this repository. From the project root folder, run

`npm install`

#### update app config files
create a copy of ./config/config.js.init and call it ./db/config.js
set the mongoDbEndpoint database names for your environments

create a copy of ./db/initialDb.js.init and call it ./db/initialDb.js
create your seed user accounts in the initialDb.initialUsers function of that file
Note that you will want to create 2 users to play with the chat function

#### initialize database in dev

`node ./db/dbreset.js` or `npm dbinit`

### run
`npm start`

## TODO
* code cleanup
* cleanup logger
* fix left side bar placement
* add username to chat output
* reformat chat div
* add video (webrtc, stun/turn, etc)

## Additional Info
### ssl cert generation

openssl req -new -newkey rsa:2048 -nodes -keyout wildcard-keyname.key -out wildcard-keyname.csr

### ssl cert installation

Namecheap sends zip containing cert and associated chain certs. These need to be concatentated into a single file (file order is important)

cat __keyname_dev.crt __keyname_dev.ca-bundle >> __keyname_dev_cert_chain.crt

Use the cert chain file and .key created when the .csr was generated and place them in the ssl certs folder for the web server (/etc/ssl for our usual nginx configuration)

Place reference in the nginx config for those servers using ssl.

###  check ssl expiration

openssl x509 -enddate -noout -in certificate.crt

## Archive
### express generator output

``vmax:nodeapp john$ express --ejs --view ejs --git

warning: option `--ejs' has been renamed to `--view=ejs'

destination is not empty, continue? [y/N] y

create : public/
create : public/javascripts/
create : public/images/
create : public/stylesheets/
create : public/stylesheets/style.css
create : routes/
create : routes/index.js
create : routes/users.js
create : views/
create : views/error.ejs
create : views/index.ejs
create : .gitignore
create : app.js
create : package.json
create : bin/
create : bin/www

install dependencies:
$ npm install

run the app:
$ DEBUG=nodeapp:* npm start``
