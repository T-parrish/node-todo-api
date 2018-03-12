const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		// use return to escape function and not run anything else
		return console.log('something went wrong... unable to connect')
	} 

	console.log('Connected to mongodb server');
	// db.collection('Todos').find({_id: new ObjectID("5aa63dfd7827ce3fa9bc36a6")}).toArray().then((docs) => {
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// 	console.log('Todos');

	// }, (err) => {
	// 	console.log('unable to find todos', err);
	// });

	db.collection('Users').find({name: 'Mr. Bojangles'}).toArray().then((docs) => {
		console.log(JSON.stringify(docs, undefined, 2));
		console.log('Todos');

	}, (err) => {
		console.log('unable to find Users', err);
	});

	db.collection('Users').find({name: 'Mr. Bojangles'}).count().then((count) => {
		console.log(`Users count: ${count}`)

	}, (err) => {
		console.log('unable to find Users', err);
	});

	// db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todos count: ${count}`)

	// }, (err) => {
	// 	console.log('unable to find todos', err);
	// });

	// db.close();
});