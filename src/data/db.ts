const dbEngine = process.env.ENVIRONMENT || 'development';
const config = require('./knexfile')[dbEngine]
const db = require('knex')(config)

export default db;
