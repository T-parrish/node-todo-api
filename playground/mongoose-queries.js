const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');



var id = "5aaa437c36fb13b74523a089"

if (!ObjectID.isValid(id)) {
	console.log('ID not valid')
}

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log('Todos', todos);
// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo', todo);
// });


// // can trigger an error that alerts you to an invalid object
// // catch triggers 'cast to object id' failure
// Todo.findById(id).then((todo) => {
// 	if (!todo) {
// 		return console.log('ID not found')
// 	}
// 	console.log('Todo by id', todo);
// }).catch((e) => console.log(e));


User.find({
	_id: id
}).then((users) => {
	console.log('Users', users);
});

User.findOne({
	_id: id
}).then((user) => {
	console.log('User', user);
});

User.findById(id).then((user) => {
	if (!user) {
		return console.log('ID not found')
	}
	console.log('User by id', user);
}).catch((e) => console.log(e));