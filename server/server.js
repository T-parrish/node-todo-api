var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	console.log(req.body);

});


activePort = 3000;

app.listen(activePort, () => {
	console.log(`server running on port ${activePort}`)
});