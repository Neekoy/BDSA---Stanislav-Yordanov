var express = require('express');
var router = express.Router();

router.get('/admin', ensureAuthenticated, function(req, res){
	res.render('admin', { layout: 'default' });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		if (req.user.admin === true) {
			console.log("WOW REDIRECT");
			return next();
		} else {
			res.redirect('/users/login');
		}
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
