require('./config/config.js')

const {ObjectID} = require('mongodb');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate')

const port = process.env.PORT;


var app = express();

app.use(bodyParser.json());

// Authenticated POST route for creating new Todos
app.post('/todos', authenticate, async (req, res) => {
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	try {
		var doc = await todo.save()
		res.send(doc)
	} catch (e) {
		res.status(400).send(e);
	}
});

// Authenticated GET route for users to retrieve their own todos
app.get('/todos', authenticate, async (req, res) => {
	try {
		var todos = await Todo.find({_creator: req.user._id})
		res.send({todos})
	} catch (e) {
		res.status(404).send(e);		
	}
});

// Authenticated GET route for users to retrieve specific todo by id
app.get('/todos/:id', authenticate, async (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return console.log(`${id} is not a valid id`)
	}  
	
	try {
	var todo = await Todo.findOne({
		_id: id,
		_creator: req.user._id
	})
	
	if (!todo) {
			res.status(404).send()
			return console.log('ID not found')
	}

	res.send({todo})
	res.status(200).send()
	} catch (e) {
		res.status(400).send()
	}
});

// Authenticated DEL route for users to remove todo by id
app.delete('/todos/:id', authenticate, async (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return console.log(`${id} is not a valid id`)
	}  

	try {
		var todo = await Todo.findOneAndRemove({_id: id, _creator: req.user._id})
		
		if(!todo) {
			res.status(404).send();
			return console.log('no todo found with that ID');
		}

		res.send({todo});

	} catch (e) {
		res.status(400).send();
	}
});

// Authenticated UPDATE route for users to modify todo by id
app.patch('/todos/:id', authenticate, async (req, res) => {
	var id = req.params.id;
	// only allows the text and completed fields to be modified by the endpoint
	var body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}
	try {
	var todo = await Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	}, {$set: body}, {new:true})
	
	if (!todo) {
			return res.status(404).send();
	}

	res.send({todo});

	} catch (e) {
		res.status(400).send();
	}
});

// POST route for people to create a new user / account
app.post('/users', async (req, res) => {
	try {
		var body = _.pick(req.body, ['email', 'password']);
		var user = new User(body);
		await user.save();
		var token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

// // GET route to retrieve all users, for testing purposes only
// app.get('/users', async (req, res) => {
	
// 	try {
// 		var users = await User.find()
// 		res.send({users})
// 	} catch (e) {
// 		res.status(404).send(e);
// 	}
// });

// GET route to retrieve user account by x-auth header token
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

// POST route for user to login / generate new x-auth header token
app.post('/users/login', async (req, res) => {
	try {
		var body = _.pick(req.body, ['email', 'password']);
		var user = await User.findByCredentials(body.email, body.password);
		var token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	} catch (e) {
		res.status(400).send();
	}
});

// DELETE route for user to logout / remove their x-auth header token
app.delete('/users/me/token', authenticate, async (req, res) => {
	try {
		await req.user.removeToken(req.token);
		res.status(200).send()
	} catch (e) {
		res.status(400).send()
	}
});


app.listen(port, () => {
	console.log(`server running on port ${port}`)
});


module.exports = {app};