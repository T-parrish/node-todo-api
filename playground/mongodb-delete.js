const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('something went wrong... unable to connect')
	} 

	console.log('Connected to mongodb server');

	// // Delete many
	// db.collection('Todos').deleteMany({text: 'Something to do'}).then((result) => {
	// 	console.log(result);
	// });

	// // Delete one
	// db.collection('Todos').deleteOne({text: 'walk the dog'}).then((result) => {
	// 	console.log(result)
	// });

	// // Find one and Delete
	// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
	// 	console.log(result)
	// });

	db.collection('Users').findOneAndDelete({_id: new ObjectID("5aa64c604c7a58ce09482202")}).then((result) => {
		console.log(result)
	});

	db.collection('Users').deleteMany({name: 'Mr. Bojangles'}).then((result) => {
		console.log(result);
	});


});

