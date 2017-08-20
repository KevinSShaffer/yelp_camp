var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var expressSession = require('express-session');
var flash = require('connect-flash');

var seedDB = require('./seeds');
//seedDB();

/* App Config */
	var app = express();
	app.set('view engine', 'ejs');
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.static(__dirname + '/public'));
	app.use(expressSession({
		secret: 'I am really enjoying this tutorial.',
		resave: false,
		saveUninitialized: false
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
/* End App Config */

/* Middleware */
	app.use(function(req, res, next) {
		res.locals.isLandingPage = req.isLandingPage;
		res.locals.user = req.user;
		res.locals.error = req.flash('error');
		res.locals.success = req.flash('success');
		next();
	});
/* End Middleware */

/* Mongo schemas */
	var Camp = require('./models/camp');
	var Comment = require('./models/comment');
	var User = require('./models/user');
	passport.use(new LocalStrategy(User.authenticate()));
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());
/* End Mongo Schemas */

/* Routes */
	app.use('/CampSites', require('./routes/camps'));
	app.use('/CampSites/:id/comments', require('./routes/comments'));
	app.use(require('./routes/index'));
/* End Routes */

/* Connections */
	app.listen(3000, function() {
		console.log('Yelp camp application listening on port 3000');
	});

	mongoose.connect('mongodb://localhost/yelp_camp', {
	  useMongoClient: true
	});
/* End Connections */