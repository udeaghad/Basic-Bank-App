import type { Knex } from "knex";
import path from "path";


// Update with your config settings.
const databasePort: number = Number(process.env.DB_PORT) || 5001;

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql",
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME, 
      port: databasePort,     
    },
    migrations: {
      extension: "ts"
    }
  
  },

}

