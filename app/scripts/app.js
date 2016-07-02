//https://scotch.io/tutorials/easy-node-authentication-setup-and-local
//http://uitblog.com/postgres-with-passport/
//https://github.com/clouie87/nodeAuthTutorial/blob/master/app/models/user.js
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var passport = require('passport');
var session = require('express-session');
var pg = require('pg');
var flash = require('connect-flash');
//var dbConfig = require('./scripts/services/database.js')
var engines = require('consolidate');
var $ = require('jquery');
require('./services/chat')(io);

var conString = "postgres://postgres:postgres@localhost:5432/amatyastore";
var client = new pg.Client(conString);

//Serving static files
app.use("/public", express.static(__dirname + '../../bower_components/'));

// required for passport
require('./config/passport')(passport); // pass passport for configuration
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(session({
    secret: 'kitty cat',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// set view engine
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/scripts/views/');


// routes ======================================================================
require('./filters/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
var port = 80;
http.listen(port, function() {
    console.log('listening on *: ' + port);
});