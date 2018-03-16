const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


// jwt.io for documentation
// jwt.sign
// jwt.verify

var data = {
	id: 10
};

// takes the data object and the secret salt
var token = jwt.sign(data, '123abc');

console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded ', decoded);

// var message = 'Look at this. Look at this thing'
// var hash = SHA256(message).toString();


// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)

// var data = {
// 	id: 4
// };

// var token = {
// 	data,
// 	// salting a hash to make sure that the output cannot be manipulated
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
// 	console.log('Data was not changed');
// } else {
// 	console.log('Data was changed. Dont trust');
// }