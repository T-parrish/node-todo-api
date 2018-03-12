const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		// use return to escape function and not run anything else
		return console.log('something went wrong... unable to connect')
	} 

	console.log('Connected to mongodb server');
	// query db for everything that matches the key: value pair
	// db.collection('Todos').find({completed: true}).toArray().then((docs) => {
	db.collection('Todos').find({
		// won't match without building a new ObjectID object with the id string
		_id: new ObjectID("5aa63dfd7827ce3fa9bc36a6")
	}).toArray().then((docs) => {
		console.log(JSON.stringify(docs, undefined, 2));
		console.log('Todos');

	}, (err) => {
		console.log('unable to find todos', err);
	});

	db.close();

});