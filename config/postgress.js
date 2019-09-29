const {Pool, Client} = require('pg');
const config = require('./config');
const db = config.postgre;

const pool = new Pool(db);

const client = new Client(db);

const connectDB = async () => {
	try {
		await client.connect();
		console.log('PostgreSQL Connected...');
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
