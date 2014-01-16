// Policies:
// 
// middleware functions which run before controllers
// 
// any of these policies can be applied to any controller or one or more of the actions.

module.exports = function(req, res, next) {
	
	res.locals.flash = {};
	
	if(!req.session.flash) return next();
	
	res.locals.flash = _.clone(req.session.flash);
	
	// clear flash
	req.session.flash = {};
	
	next();
};