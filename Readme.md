
## Setup

## node

tool versions on osx:
nvm 0.39.2
node v18.12.0
npm 9.1.3

### web app

`npm install`

initialize database in dev

`node ./db/dbreset.js`

### ssl cert generation

openssl req -new -newkey rsa:2048 -nodes -keyout wildcard-johnfowler.key -out wildcard-johnfowler.csr


### ssl cert installation

Namecheap sends zip containing cert and associated chain certs. These need to be concatentated into a single file (file order is important)

cat __johnfowler_dev.crt __johnfowler_dev.ca-bundle >> __johnfowler_dev_cert_chain.crt

Use the cert chain file and .key created when the .csr was generated and place them in the ssl certs folder for the web server (/etc/ssl for our usual nginx configuration)

Place reference in the nginx config for those servers using ssl.


###  check ssl expiration

openssl x509 -enddate -noout -in certificate.crt

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
