import dotenv from 'dotenv';
dotenv.config();

// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      
    },
    migrations: {
      directory: 'migrations',
      extension: 'ts',
      loadExtensions: ['.ts', '.js']
    } 

  },

  test: {
    client: 'mysql',
    connection: {
      database: 'test_raven_db',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    },
    migrations: {
      directory: __dirname + '/src/data/migrations',
      extension: 'ts',
      loadExtensions: ['.ts', '.js']
    } 

  }

};
