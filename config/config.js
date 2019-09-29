module.exports = {
	mongoURI:
		process.env.MONGO_DB_URI ||
		'mongodb+srv://taskmanager:goit34GH@taskmanager-dsu46.mongodb.net/test?retryWrites=true&w=majority',
	apiPATH: '/api',
	apiVersion: '/v1',
	jwtSecretKey: 'blabLaKey',
	postgre: {
		user: 'taskmanager',
		host: '93.126.94.66',
		database: 'test',
		password: 'goit34GH',
		port: 65432
	}
};
