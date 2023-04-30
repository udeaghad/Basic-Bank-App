import Knex from 'knex';
import dotenv from 'dotenv'

dotenv.config();

const portNumber: number = Number(process.env.DB_PORT)

const database = 'test_raven_db'

const tearDownDatabase = async () => {
  const knex = Knex({
    client: 'mysql2',
    connection: {
      // database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: portNumber,
      /* connection info without database */
    },
  })

  try {
    await knex.raw(`DROP DATABASE IF EXISTS ${database}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = async () => {
  try {
    await tearDownDatabase()
    
    console.log('Test database created successfully')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}