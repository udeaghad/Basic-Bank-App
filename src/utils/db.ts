import knex from "knex";
import { config } from "../knexfile";

const environment = process.env.NODE_ENV || 'developemt';
const configOptions = config[environment]
const db = knex(configOptions)

export default db;