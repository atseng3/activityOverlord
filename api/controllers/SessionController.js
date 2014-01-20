/**
 * SessionController
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
		
		// debugging function:
		// sets old/new Date Objs and sets the cookie expiration to 60s. 
		// starting from /user page (index action) after 60s the user will be no longer authenticated.
		
		// var oldDateObj = new Date();
		// var newDateObj = new Date(oldDateObj.getTime() + 60000);
		// req.session.cookie.expires = newDateObj;
		// req.session.authenticated = true;
		// console.log(req.session);
		// console.log(new Date());
		res.view('session/new');
	},
	
	'create': function(req, res, next) {
		
		// Check for email and password in params sent via the form, if none
		// redirect the browser back to the sign-in form.
		if(!req.param('email') || !req.param('password')) {
			// return next({err: ["Password doesn't match password confirmation"]});
			
			var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: 'You must enter both a username and password'}]
			
			// Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
			// the key of usernamePasswordRequiredError
			req.session.flash = {
				err: usernamePasswordRequiredError
			}
			
			res.redirect('/session/new');
			return;
		}
		
		// Try to find the user by their email address.
		User.findOneByEmail(req.param('email')).done(function(err, user) {
			if (err) return next(err);
			
			// If no user is found...
			if(!user) {
				var noAccountError = [{name: 'noAccount', message: 'The email address ' + req.param('email') + ' not found.'}];
				req.session.flash = {
					err: noAccountError
				}	
				res.redirect('/session/new');
				return;
			}
			
			// Found the user: Compare password from the form params to the encrypted password of the user found.
			require('bcrypt').compare(req.param('password'), user.encryptedPassword, function(err, valid) {
				if (err) return next(err);
				
				// If the password from the form doesn't match the password from the database...
				if (!valid) {
					var usernamePasswordMismatchError = [{name: 'usernamePasswordMismatch', message: 'Invalid username and password combination.'}];
					req.session.flash = {
						err: usernamePasswordMismatchError
					}
					res.redirect('/session/new');
					return;
				}
				
				// Log user in 
				req.session.authenticated = true;
				req.session.User = user;
				
				// If the user is also an admin redirect ot the user list (e.g. /views/user/index.ejs)
				// This is used in conjunction with config/policies.js file
				if (req.session.User.admin) {
					res.redirect('/user');
					return;
				}
				
				// Redirect to their profile page (e.g. /views/user/show.ejs)
				res.redirect('/user/show/' + user.id);
			});
		});
	},
	
	'destroy': function(req, res, next) {
		
		// Wipe out the session (log out)
		req.session.destroy();
		
		// Redirect the browser to the sign-in screen
		res.redirect('/session/new');
	},
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SessionController)
   */
  _config: {}

  
};
