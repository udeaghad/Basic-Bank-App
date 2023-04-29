import request from 'supertest'
import Knex from 'knex';
import app from '../../app';

describe('Accounts', () => {
  
  let config = require('../../../knexfile')
  let db = Knex(config.test)
  
  afterAll(() => {
    db.destroy()
  })

  it('Should Create account', async() => {
    const newAccunt = { 
      name: 'James Brown', 
      email: 'james10@example.com', 
      password: '12345',
      confirmPassword: '12345', 
      balance: 25,             
    }
    const {body} = await request(app).post('/api/v1/auths/account/create').send(newAccunt)

    console.log(body)

    // expect(statusCode).toEqual(201)
    // expect(text).toBe("Company created successfully")

  })
})