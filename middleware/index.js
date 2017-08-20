var Camp = require('../models/camp');
var Comment = require('../models/comment');

var isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.flash('error', 'Please log in');
		res.redirect('/login');
	}
};
var isCampAuthor = function(req, res, next) {
	if (req.isAuthenticated()) {
		Camp.findById(req.params.id, function(err, camp) {
			if (err) {
				res.send('Unable to find camp site: ' + err);
			} else if (camp.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash('error', 'You are not the author');
				res.redirect('/CampSites/' + camp._id);
			}
		});
	} else {
		res.redirect('/login');
	}
}
var isCommentAuthor = function(req, res, next) {
	Comment.findById(req.params.commentId, function(err, comment) {
		if (err) {
			res.send('Unable to find comment: ' + err);
		} else if (comment.author.id.equals(req.user._id)) {
			next();
		} else {
			req.flash('error', 'You are not the author');
			res.redirect('back');
		}
	});
};

module.exports = {
	isLoggedIn: isLoggedIn,
	isCampAuthor: isCampAuthor,
	isCommentAuthor: isCommentAuthor
}