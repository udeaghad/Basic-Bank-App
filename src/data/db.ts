const dbEngine = process.env.Environment || 'development';
const config = require('../../knexfile')[dbEngine]
const db = require('knex')(config)

export default db;
