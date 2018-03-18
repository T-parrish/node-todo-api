const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')


var password = '123abc!';


// first argument is how many rounds to generate salt, second is call back
// bigger the number of rounds, the longer this algorithm takes.

bcrypt.genSalt(10, (err, salt) => {
	// thing to hash, salt to use, callback function
	bcrypt.hash(password, salt, (err, hash) => {
		console.log(hash);
	});
});

var hashedPassword = '$2a$10$S.E8q0dZBsNSN3C9rBKpxu8H.cXQ5zDrWV9oRe/wH6A6q7WXcigZy'

bcrypt.compare(password, hashedPassword, (err, res) => {
	console.log(res)
})