var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', function(req, res){
	res.render('homepage', { layout: 'default'});
});

router.get('/success', function(req, res){
	res.render('success', { layout: 'default' });
});



module.exports = router;
