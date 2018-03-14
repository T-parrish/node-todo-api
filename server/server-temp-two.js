const mongoose = require('mongoose');

// specify which promise protocol to use with mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');


// mongoose makes everything lowercase and adds an 's' 
var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		// removes leading or trailing white space
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Date,
		default: Date.now()
	}
});


var anotherTodo = new Todo({
	text: 'Drop it like its hawt'
});

anotherTodo.save().then((doc) => {
	console.log(`Saved todo ${doc}`)
}, (e) => {
	console.log('Unable to save todo')
});

// User model
var User = mongoose.model('User', {
	name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
});

var newUser = new User({
	name: 'Mr. Bojangles',
	email: 'loopzoop@gmail.com'
});

newUser.save().then((doc) => {
	console.log(`Saved User ${doc}`)
}, (e) => {
	console.log('Unable to save User')
});
