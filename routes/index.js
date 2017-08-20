var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/', function(req, res) {
	res.render('landing', { isLandingPage: true });
});

router.get('/register', function(req, res) {
	res.render('register');
});
router.post('/register', function(req, res) {
	User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
		if (err) {
			req.flash('error', err.message);
			res.redirect('/register');
		} else {
			passport.authenticate('local')(req, res, function() {
				req.flash('success', 'Welcome to YelpCamp ' + user.username);
				res.redirect('/campSites');
			});
		}
	});
});

router.get('/login', function(req, res) {
	res.render('login');
});
router.post('/login', passport.authenticate('local', {
		successRedirect: 'campsites',
		successFlash: 'Welcome back!',
		failureRedirect: 'login',
		failureFlash: 'Invalid credentials'
	}), function(req, res) {

});

router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'Goodbye!');
	res.redirect('/');
});

module.exports = router;