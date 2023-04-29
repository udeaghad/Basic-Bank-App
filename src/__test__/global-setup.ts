import Knex from 'knex';
import dotenv from 'dotenv'

dotenv.config();

const portNumber: number = Number(process.env.DB_PORT)

const database = 'test_raven_db'

// Create the database
const createTestDatabase = async() => {
  const knex = Knex({
    client: 'mysql',
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
    await knex.raw(`CREATE DATABASE ${database}`)
  } catch (error: any) {
    throw new Error(error)
  } finally {
    await knex.destroy()
  }
}

// Seed the database with schema and data
const seedTestDatabase = async() => {
  const knex = Knex({
    client: 'mysql',
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: portNumber,
      /* connection info with database */
    },
  })

  try {
    await knex.migrate.latest()
    await knex.seed.run()
  } catch (error: any) {
    throw new Error(error)
  } finally {
    await knex.destroy()
  }
}

module.exports = async () => {
  try {
    await createTestDatabase()
    await seedTestDatabase()
    console.log('Test database created successfully')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}