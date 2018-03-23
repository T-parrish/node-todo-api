var mongoose = require('mongoose');

// specify which promise protocol to use with mongoose
// global.Promise is the normal one baked into js
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
	mongoose
}

// set to production automatically on heroku
// process.env.NODE_ENV === 'production'