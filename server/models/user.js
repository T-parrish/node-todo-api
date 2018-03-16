const mongoose = require('mongoose');
const validator = require('validator');

const jwt = require('jsonwebtoken');

const _ = require('lodash');

// // Example of data passed into user model
// {
// 	email: 'loopzoop@gmail.com'
// 	// will be hashed in the database
// 	password: 'shwiggidyshwiggidy'
// 	tokens: [{
// 		access: 'auth',
// 		// long cryptographic string
// 		token: 'asldfkjsfdkhzdlfialkkvjmnxczxcv'
// 	}]
// }

// by using a schema over a model declaration you can create custom instance methods
var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});


UserSchema.methods.toJSON = function () {
	var user = this
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};


// don't use arrow functions because they don't bind a 'this' keyword
// we need the 'this' keyword for our methods because the 'this' keyword
// stores the individual document
UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens = user.tokens.concat([{access, token}]);

	// in order to allow server.js to chain onto the promise, follow this syntax
	// saves the info to the user model then returns the token value for server.js to chain
	return user.save().then(() => {
		return token;
	});
};

var User = mongoose.model('User', UserSchema)

module.exports = {
	User
}