const config = require('../../knexfile')
const knex = require('knex')
const db = knex(config.development)

export default db;