var mongoose = require('mongoose')

// User model
var User = mongoose.model('User', {
	name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
});

// var newUser = new User({
// 	name: 'Mr. Bojangles',
// 	email: 'loopzoop@gmail.com'
// });

// newUser.save().then((doc) => {
// 	console.log(`Saved User ${doc}`)
// }, (e) => {
// 	console.log('Unable to save User')
// });

module.exports = {
	User
}