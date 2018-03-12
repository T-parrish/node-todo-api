// Object destructuring --> lets you pull properties from an object to create variables
// eg: var user = {name: 'Taylor', age:'28'}
// var {name} = user;

// Two ways to accomplish similar things
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// create a new instance of objectid and store it in a variable
// var obj = new ObjectID();
// console.log(obj);

// first argument is where the connection is located, second argument is callback function
// no need to create a new database before using it, will create database when you add data
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		// use return to escape function and not run anything else
		return console.log('something went wrong... unable to connect')
	} 

	console.log('Connected to mongodb server');

	db.collection('Todos').insertOne({
		text: 'Eat some food',
		completed: true
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert todo', err);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));

	});

	// Insert new doc into Users collection (name, age, location)
	db.collection('Users').insertOne({
		name: 'Taylor',
		age: 28,
		location: 'Singapore'
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert todo', err);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));
		console.log(result.ops[0]._id.getTimestamp());
	});

	db.close();
});