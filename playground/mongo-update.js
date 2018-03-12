const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('something went wrong... unable to connect')
	} 

	console.log('Connected to mongodb server');

	// db.collection('Todos').findOneAndUpdate(
	// 	{_id: new ObjectID("5aa64e5c4c7a58ce094822b3")}
	// 	, {$set: {completed: true}}
	// 	, { returnOriginal: false }).then((result) => {
	// 		console.log(result)
	// 	});

	db.collection('Users').findOneAndUpdate(
		{_id: new ObjectID("5aa63aadcd88e23f998e6e02")},
		{
			$set: {name: 'King Louie XIV'},
			$inc: {age:-5}
		},
		{returnOriginal: false}).then((result) => {
			console.log(result);
		});

});

