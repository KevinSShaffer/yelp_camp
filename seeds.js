var mongoose = require('mongoose');
var Camp = require('./models/camp');
var Comment = require('./models/comment');

var seeds = [
	{
		name: "Big Rocks",
		image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg",
		description: "Tis a fine place with many-a-rock."
	},
	{
		name: "Goat Mountain",
		image: "https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg",
		description: "The goat shaped mountain is narly."
	},
	{
		name: "Hilly Hills",
		image: "https://farm8.staticflickr.com/7259/7121858075_7375241459.jpg",
		description: "Lots of trees and grass, no hills though.  Just kidding!"
	}
]

module.exports = function() {
	Camp.remove({}, function(err) {
		if (err) {
			console.log('Failed to remove camps from seeds.js');
		} else {
			console.log('Removed all camps.');
		}
	});
	Comment.remove({}, function(err) {
		if (err) {
			console.log('Failed to remove comments from seeds.js');
		} else {
			console.log('Removed all comments.');
		}
	});

	// seeds.forEach(function(seed) {
	// 	Camp.create(seed, function(err, campSite) {
	// 		if (err) {
	// 			console.log('Error when creating camp site seeds: ' + err);
	// 		} else {
	// 			console.log('Added camp site seed.');

	// 			var seedComment = {
	// 				text: 'This place is great but I wish there was internet.',
	// 				author: 'Homer'
	// 			};
	// 			Comment.create(seedComment, function(err, comment) {
	// 				if (err) {
	// 					console.log('Error when creating seed comment: ' + err);
	// 				} else {
	// 					console.log('Created comment seed.');
	// 					campSite.comments.push(comment);
	// 					campSite.save();
	// 				}
	// 			})
	// 		}
	// 	})
	// })
};