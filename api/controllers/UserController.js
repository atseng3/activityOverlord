/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


module.exports = {
    
	'new': function(req, res) {
		// setting res.locals.flash and clearing req.session.flash is done in /policies/flash.js
		// res.locals.flash = _.clone(req.session.flash);
		res.view();
		// req.session.flash = {};
	},
	
	create: function(req, res) {
		// Create a User with the params sent from 
		// the sign-up form --> new.ejs
		User.create(req.params.all(), function userCreated(err, user) {
			// If there's an error
			// if (err) return next(err);
			
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err
				}
				
				// If error redirect back to sign-up page
				return res.redirect('/user/new');
			}
			
			// After successfully creating the user
			// redirect to the show action
			res.redirect('/user/show/' + user.id);
			
			// respond as json:
			// res.json(user);
			
			// clearing req.session for flash msg
			// req.session.flash = {};
		});
	},
	
	show: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			if (!user) return next();
			res.view({
				user: user
			});
		});
	},
	
	index: function(req, res, next) {
		// Get an array of all users in the User collection(e.g. table)
		User.find(function foundUsers(err, users) {
			if (err) return next(err);
			// pass the array down to the /views/index.ejs page
			res.view({
				users: users
			});
		});
	},
	
	edit: function(req, res, next) {
		// Find the user from the id passed in via params
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			if (!user) return next("User does\'t exist.");
			res.view({
				user: user
			});
		});
	},
	
	update: function(req, res, next) {
		User.update(req.param('id'), req.params.all(), function userUpdated(err) {
			if (err) {
				return res.redirect('/user/edit/' + req.param('id'));
			}
			
			res.redirect('/user/show/' + req.param('id'));
		});
	},
	
	destroy: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			
			if (!user) return next("User does\'t exist.");
			
			User.destroy(req.param('id'), function userDestroyed(err) {
				if (err) return next(err);
			});
			
			res.redirect('/user');
			
		});
	},


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}

  
};
