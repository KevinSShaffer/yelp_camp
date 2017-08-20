var express = require('express');
var router = express.Router({ mergeParams: true });
var Camp = require('../models/camp');
var Comment = require('../models/comment');
var middleWare = require('../middleware');

var commentById = function(camp, commentId) {
	if (camp.comments) {
		var foundComment = null;
		camp.comments.forEach(function(comment) {
			if (comment._id == commentId) {
				foundComment = comment;
			}
		});
		return foundComment;
	} else {
		return null;
	}
};

// CREATE - Create new comment
router.post('/', middleWare.isLoggedIn, function(req, res) {
	Camp.findById(req.params.id, function(err, campSite) {
		if (err) {
			req.flash('error', 'Unable to find camp site');
			console.log(err);
			res.redirect('/CampSites');
		} else if (!campSite) {
			req.flash('error', 'Unable to find camp site');
			console.log(err);
			res.redirect('/CampSites');
		} else {
			Comment.create(req.body.comment, function(err, newComment) {
				if (err) {
					req.flash('error', 'Unable to add comment');
					console.log(err);
					res.redirect('/CampSites/' + req.params.id);
				} else {
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					
					campSite.comments.push(newComment);
					campSite.save();
					req.flash('success', 'Comment added!');
					res.redirect('/CampSites/' + campSite._id);
				}
			});
		}
	});
});
// NEW - Form used to create new comemnt
router.get('/new', middleWare.isLoggedIn, function(req, res) {
	Camp.findById(req.params.id, function(err, campSite) {
		if (err) {
			req.flash('error', 'Unable to find camp site');
			console.log(err);
			res.redirect('/CampSites');
		} else {
			res.render('comments/new', { campSite: campSite });
		}
	});
});

// UPDATE
router.put('/:commentId', middleWare.isCommentAuthor, function(req, res) {
	Comment.findByIdAndUpdate(req.params.commentId, { $set: req.body.comment }, function(err, comment) {
		if (err) {
			req.flash('error', 'Unable to update comment');
			console.log(err);
			res.redirect('/CampSites');
		} else {
			req.flash('success', 'Comment updated!');
			res.redirect('/CampSites/' + req.params.id);
		}
	})
});
// EDIT
router.get('/:commentId/edit', middleWare.isCommentAuthor, function(req, res) {
	Camp.findById(req.params.id).populate('comments').exec(function(err, campSite) {
		if (err) {
			req.flash('error', 'Unable to find camp site');
			console.log(err);
			res.redirect('/CampSites');
		} else {
			var comment = commentById(campSite, req.params.commentId);

			if (comment) {
				res.render('comments/edit', { campSite: campSite, comment: comment });				
			} else {
				req.flash('error', 'Unable to find comment');
				console.log(err);
				res.redirect('/CampSites/' + req.params.id);
			}
		}
	});
});
// DESTROY
router.delete('/:commentId', middleWare.isCommentAuthor, function(req, res) {
	Comment.findByIdAndRemove(req.params.commentId, function(err) {
		if (err) {
			req.flash('error', 'Unable to delete comment');
			console.log(err);
			res.redirect('/CampSites/' + req.params.id);
		} else {
			req.flash('success', 'Comment deleted!');
			res.redirect('/CampSites/' + req.params.id);
		}
	})
})

module.exports = router;