const Knex = require('knex');
const dotenv = require('dotenv')

const databaseName = process.env.DB_NAME;

const main = async() => {
  let knex = Knex({
    client: 'mysql2',
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    }
  })

  try {    
    await knex.raw('CREATE DATABASE IF NOT EXISTS ??', databaseName)
    .then(() => {
      console.log(`Database with name ${databaseName} created successfully`)
      process.exit(1)
    })
  } catch (error) {
    console.error(error)
  } finally {
    await knex.destroy()
  }
  
  

}

main().catch(console.error) 