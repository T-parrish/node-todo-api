var mongoose = require('mongoose');

// specify which promise protocol to use with mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
	mongoose
}