var express = require('express');
var router = express.Router();
var path = require('path');

// Get Homepage
router.get('/', function(req, res){
	res.render('homepage', { layout: 'default'});
});

router.get('/webinar-info', function(req, res) {
	res.render('webinar-info', { layout: 'default' });
});

router.get('/webinar-current-info', function(req, res) {
    res.render('webinar-current-info', { layout: 'default' });
});

router.get('/success', function(req, res){
	res.render('success', { layout: 'default' });
});

router.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(path.join(__dirname + '/../public/images/personPic.jpg'), function(err) {
    if (err)
      return res.status(500).send(err);

    res.render('admin');
  });
});


module.exports = router;
