const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// Todo.remove({}).then((result) => {
// 	console.log(result)
// });

Todo.findByIdAndRemove("5aab55186b0ef2cb4bf678ba").then((todo) => {
	if(!todo) {
		return console.log('ID not found')
	}
	console.log('Todo by id', todo);
}).catch((e) => console.log(e))

Todo.findOneAndRemove({_id: "5aab55186b0ef2cb4bf678ba"}).then((todo) => {
	if(!todo) {
		return console.log('ID not found')
	}
	console.log('Todo by id', todo);
}).catch((e) => console.log(e))
