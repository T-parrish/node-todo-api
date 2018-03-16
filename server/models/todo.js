var mongoose = require('mongoose');

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
		type: Number,
		default: null
	}
});


// var anotherTodo = new Todo({
// 	text: 'Drop it like its hawt'
// });

// anotherTodo.save().then((doc) => {
// 	console.log(`Saved todo ${doc}`)
// }, (e) => {
// 	console.log('Unable to save todo')
// });

module.exports = {
	Todo
}