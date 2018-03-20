var env = process.env.NODE_ENV || 'development';
console.log('env ******', env)


if (env === 'development' || env === 'test') {
	// requiring JSON will automatically parse it into a javascript object
	var config = require('./config.json');
	var envConfig = config[env];

	// takes an object, returns keys as an array
	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key];
	});
}


// settings before breaking config out into JSON
// if (env === 'development') {
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
