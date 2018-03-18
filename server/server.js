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

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos})
	}, (e) => {
		res.status(404).send(e);
	});
});

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return console.log(`${id} is not a valid id`)
	}  
	
	Todo.findById(id).then((todo) => {
		if (!todo) {
			res.status(404).send()
			return console.log('ID not found')
		}
		res.send({todo})
		res.status(200).send()
	}).catch((e) => console.log(e));
});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return console.log(`${id} is not a valid id`)
	}  

	Todo.findByIdAndRemove(id).then((todo) => {
		if(!todo) {
			res.status(404).send();
			return console.log('no todo found with that ID');
		}

		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.patch('/todos/:id', (req, res) => {
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

	// new:true returns the new doc rather than the old one
	Todo.findByIdAndUpdate(id, {$set: body}, {new:true}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	})
});

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	user.save().then(() => {
		// instead of responding, will call new instance method instead
		// res.send(user);
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.get('/users', (req, res) => {
	User.find().then((users) => {
		res.send({users})
	}, (e) => {
		res.status(404).send(e);
	});
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});


app.listen(port, () => {
	console.log(`server running on port ${port}`)
});


module.exports = {app};