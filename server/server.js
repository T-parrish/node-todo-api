var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	console.log(req.body);
	
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

// app.post('/users', (req, res) => {
// 	console.log(req.body);
	
// 	var user = new User({
// 		name: req.body.name,
// 		email: req.body.email
// 	});

// 	user.save().then((doc) => {
// 		res.send(doc);
// 	}, (e) => {
// 		res.status(400).send(e);
// 	});
// });

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos})
	}, (e) => {
		res.status(400).send(e);
	});
});


activePort = 3000;

app.listen(activePort, () => {
	console.log(`server running on port ${activePort}`)
});


module.exports = {app};