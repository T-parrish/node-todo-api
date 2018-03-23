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

app.get('/todos', authenticate, async (req, res) => {
	try {
		var todos = await Todo.find({_creator: req.user._id})
		res.send({todos})
	} catch (e) {
		res.status(404).send(e);		
	}
});

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

app.get('/users', async (req, res) => {
	
	try {
		var users = await User.find()
		res.send({users})
	} catch (e) {
		res.status(404).send(e);
	}
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

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