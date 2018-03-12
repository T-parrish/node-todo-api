const MongoClient = require('mongodb').MongoClient;


// mongodb v3 --> db argument is changed to 'client' argument
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('something went wrong... unable to connect')
	} 

	console.log('Connected to mongodb server');

	// mongodb v3 --> gives us access to a database reference 
	const db = client.db('TodoApp')

	db.collection('Todos').insertOne({
		text: 'Something to do',
		completed: false
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert todo', err);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));

	});

	// mongodb v3 --> close client
	client.close();
});