const MongoClient = require('mongodb').MongoClient;


// first argument is where the connection is located, second argument is callback function
// no need to create a new database before using it, will create database when you add data
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		// use return to escape function and not run anything else
		return console.log('something went wrong... unable to connect')
	} 

	console.log('Connected to mongodb server');

	db.collection('Todos').insertOne({
		text: 'Something to do',
		completed: false
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert todo', err);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));

	});

	db.close();
});