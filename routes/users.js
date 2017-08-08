var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sendMail = require('../mailApp');

var User = require('../models/user');

var epochTime = new Date().getTime();

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Името е задължително поле. ').notEmpty();
	req.checkBody('username', 'Имейла не е валиден. ').isEmail();
	req.checkBody('username', 'Имейла е задължително поле. ').notEmpty();
	req.checkBody('password', 'Паролата е задължително поле. ').notEmpty();
	req.checkBody('password2', 'Паролите не съвпадат. ').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			username: username,
			password: password,
			time: epochTime,
			admin: true
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		sendMail.sendMessage(username);
		console.log("Mail sent!!");
		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/success');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/admin', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/admin');
  });

router.post('/admin',
  passport.authenticate('local', {successRedirect:'/admin', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();
	req.session.username = "";
	req.session.id = "";

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports.getAllUsers = "LALALA";
module.exports = router;
