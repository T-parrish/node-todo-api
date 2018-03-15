const {ObjectID} = require('mongodb');

const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text:"first test todo"
},
{
	_id: new ObjectID(),
	text: "second thing testing"
}];



// runs code before each test
beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	// have to specify done because it's an asynchronous function
	it('should create a new todo', (done) => {
		var text = "Testing todo text";

		request(app)
			.post('/todos')
			// gets converted to JSON automatically by supertest
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				// only find the entry where text = text variable above
				// makes sure that there would only be 1 returned value
				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});
	
	it('should not create todo with invalid body data', (done) => {

		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				// since there are two objects added after the beforeEach database wipe
				// the expect clause needs to expect 2 objects rather than 0
				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
	});
});

describe('GET /todos', () => {
	// have to specify done because it's an asynchronous function
	it('should find our todos', (done) => {

		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2)
			})
			.end(done);
		});
	
});

describe('GET /todos/:id', () => {
	// have to specify done because it's an asynchronous function
	it('should return a todo doc', (done) => {

		request(app)
			// need to call the toHexString method to convert the value to a strong
			// before you can pass it effectively into the route
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
		});
	
	it('should return a 404 if todo not found', (done) => {
		var hexId = new ObjectID().toHexString();
		
		request(app)
			.get(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});
	
	it('should return a 404 for non-object ids', (done) => {
		request(app)
			.get(`/todos/123abc`)
			.expect(404)
			.end(done);
	});
});


