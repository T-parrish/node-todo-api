const mongoose = require('mongoose');

// specify which promise protocol to use with mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');


// mongoose makes everything lowercase and adds an 's' 
var Todo = mongoose.model('Todo', {
	text: {
		type: String
	},
	completed: {
		type: Boolean
	},
	completedAt: {
		type: Date
	}
});

var newTodo = new Todo({
	text: 'Teach me how to dougie',
	completed: false
});

var anotherTodo = new Todo({
	text: 'Loop the Zoop',
	completed: false,
	completedAt: Date.now()
});

newTodo.save().then((doc) => {
	console.log(`Saved todo ${doc}`)
}, (e) => {
	console.log('Unable to save todo')
});

anotherTodo.save().then((doc) => {
	console.log(`Saved todo ${doc}`)
}, (e) => {
	console.log('Unable to save todo')
});

