var express = require('express');
var router = express.Router();
var methodOverride = require('method-override');
var Camp = require('../models/camp');
var middleWare = require('../middleware');

router.use(methodOverride('_method'));

// INDEX - Show all camp sites
router.get('/', function(req, res) {
	Camp.find({}, function(err, campSites) {
		if (err) {
			req.flash('error', 'Unable to show camp sites.');
			console.log(err);
			res.redirect('/');
		} else {
			res.render('campgrounds/index', { campSites: campSites });
		}
	});
});
// CREATE - Create new camp site
router.post('/', middleWare.isLoggedIn, function(req, res) {
	var campSite = req.body.campSite;
	campSite.author = {
		id: req.user._id,
		username: req.user.username
	}

	Camp.create(campSite, function (err, campSite) {
		if (err) {
			req.flash('error', 'Unable to add camp site');
			console.log(err);
			res.redirect('/CampSites');
		} else {
			req.flash('success', 'Camp site added!');
			res.redirect('/CampSites');
		}
	});
});
// NEW - Form used to create new camp site
router.get('/New', middleWare.isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});
// SHOW - Shows specific info about a camp site
router.get('/:id', function(req, res) {
	Camp.findById(req.params.id).populate('comments').exec(function(err, campSite) {
		if (err) {
			req.flash('error', 'Unable to find camp site');
			console.log(err);
			res.redirect('/CampSites');
		} else {
			res.render('campgrounds/show', { campSite: campSite });	
		}
	});
});
// UPDATE - Updates the camp site (PUT verb)
router.put('/:id', middleWare.isCampAuthor, function(req, res) {
	Camp.update({ _id: req.params.id }, { $set: req.body.campSite }, function(err, campSite) {
		if (err) {
			req.flash('error', 'Unable to update camp site');
			console.log(err);
			res.redirect('/CampSites');
		} else {			
			req.flash('success', 'Camp site updated!');
			res.redirect("/CampSites/" + req.params.id);
		}
	});
});
// EDIT - Form used to edit a camp site
router.get('/:id/edit', middleWare.isCampAuthor, function(req, res) {
	Camp.findById(req.params.id, function(err, campSite) {
		if (err) {
			req.flash('error', 'Unable to find camp site');
			console.log(err);
			res.redirect('/CampSites');
		} else {
			res.render('campgrounds/edit', { campSite: campSite });	
		}
	});
});
// DESTROY - Delete camp site
router.delete('/:id', middleWare.isCampAuthor, function(req, res) {
	Camp.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			req.flash('error', 'Unable to delete camp site');
			console.log(err);
			res.redirect('/CampSites');
		} else {
			req.flash('success', 'Camp site deleted!');
			res.redirect('/CampSites');
		}
	})
})

module.exports = router;