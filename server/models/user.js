const mongoose = require('mongoose');
const validator = require('validator');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const _ = require('lodash');

// By using a schema over a model declaration you 
// can create custom instance / model methods
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
// instance methods call the individual document, so use lower case user
UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	// var token = jwt.sign({_id: user._id.toHexString(), access}, <secret salt>);
	// generates salted and hashed password string -> saves to token variable
	var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET);

	user.tokens = user.tokens.concat({access, token});

	// in order to allow server.js to chain onto the promise, follow this syntax
	// saves the info to the user model then returns the token value for server.js to chain
	return user.save().then(() => {
		return token;
	});
};

UserSchema.methods.removeToken = function (token) {
	var user = this;
	return user.update({
		// pulls items from an array that match certain criteria
		$pull: {
			tokens: {token}
		}
	});
};

// .statics turns it into a model method instead of an instance method
// statics are model methods, and model method get called with the model as the 'this' binding
// use upper case User for these
UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);

	} catch (e) {

		return Promise.reject();
		
	}


	return User.findOne({
		'_id': decoded._id,
		// gets into the nested token field
		'tokens.token': token,
		'tokens.access': 'auth'
	})
};

UserSchema.statics.findByCredentials = function (email, password) {
	var User = this;

	return User.findOne({email}).then((user) => {
		if (!user) {
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};

UserSchema.pre('save', function (next) {
	var user = this;

	// only hashes password if the user is changed - stops database from
	// hashing passwords multiple times and locking people out
	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next();
			});
		});

	} else {
		next();
	}
});

var User = mongoose.model('User', UserSchema)

// // Example of data passed into User schema
// {
// 	email: 'foo@bar.com'
// 	// will be hashed in the database
// 	password: 'password123'
// 	tokens: [{
// 		access: 'auth',
// 		// long cryptographic string
// 		token: 'asldfkjsfdkhzdlfialkkvjmnxczxcv'
// 	}]
// }

module.exports = {
	User
}