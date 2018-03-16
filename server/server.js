const {ObjectID} = require('mongodb');

var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const port = process.env.PORT || 3000;


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
	// line below for postman testing purposes
	// res.send(req.params);
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

		res.send(todo);
	}).catch((e) => {
		res.status(400).send();
	});
});



app.listen(port, () => {
	console.log(`server running on port ${port}`)
});


module.exports = {app};