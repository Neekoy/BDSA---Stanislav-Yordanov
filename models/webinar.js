var mongoose = require('mongoose');

var WebinarSchema = mongoose.Schema({
  host: {
		type: String,
	},
    active: {
        type: Boolean,
    },
    name: {
        type: String,
    },
	video: {
		type: String
	},
	dates: {
		type: Array
	},
	addinfo: {
		type: Array
	},
});

var Webinar = module.exports = mongoose.model('Webinar', WebinarSchema);
