import type { Knex } from "knex";
import path from "path";
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env')} )

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT)
    },
    migrations: {
      directory: 'migrations',
      extension: 'ts',
    } 
  },

  test: {
    client: "mysql2",
    connection: {
      database: 'test_raven_db',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT)
    },
    migrations: {
      directory: __dirname + '/src/data/migrations',
      extension: 'ts',
    } 
  }

};

module.exports = config;
