import request from 'supertest'
import Knex from 'knex';
import app from '../../app';
import db from '../../data/db';
// import { Model } from 'objection'

describe('Accounts', () => {
  let knex: any
  let seededAccts

  beforeAll(async () => {
    // knex = Knex({
    //   /* configuration information with test_book_database */
    // })
    // Model.knex(knex)

    // Seed anything
    seededAccts= await db('accts')
      .insert([{ name: 'James Brown', email: 'james@example.com', password: '12345',  }])
      .returning('*')
  })

  afterAll(() => {
    knex.destroy()
  })

  decribe('GET /books/:id', () => {
    // Tests will go here
  })
})