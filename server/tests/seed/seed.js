const {Todo} = require('./../../models/todo');
const {ObjectID} = require('mongodb');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken')


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email : "squigglesplat@gmail.com",
	password : 'TheEagleHasLanded',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET)
	}]
},
{
	_id: userTwoId,
	email: "grizzlepants@gmail.com",
	password: 'upDogg111',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET)
	}]
}];


const todos = [{
	_id: new ObjectID(),
	text:"first test todo",
	completed : false,
	_creator: userOneId
},
{
	_id: new ObjectID(),
	text: "second thing testing",
	completedAt: 333,
	completed : false,
	_creator: userTwoId
}];

// seeds test database with users data stored in const above
const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo])
	}).then(() => done());
};

// seeds test database with todos data stored in const above
const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};