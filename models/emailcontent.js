var mongoose = require('mongoose');

var emailSchema = mongoose.Schema({
  subject: {
		type: String,
	},
	content: {
		type: String
	},
});

var Email = module.exports = mongoose.model('Email', emailSchema);
