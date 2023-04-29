import request from 'supertest';

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
    }
    const {statusCode, body} = await request(app).post('/api/v1/auths/account/create').send(newAccunt)

    expect(statusCode).toEqual(201)
    expect(body.message).toBe('Account created successfully')

  })

  it('Should return error if account already exist', async() => {
    const newAccunt = { 
      name: 'James Brown', 
      email: 'james10@example.com', 
      password: '12345',
      confirmPassword: '12345',           
    }
      await request(app).post('/api/v1/auths/account/create').send(newAccunt)
    const {statusCode, body }= await request(app).post('/api/v1/auths/account/create').send(newAccunt)

    expect(statusCode).toEqual(409)
    expect(body.message).toBe('Account already exist')

  })

  it('Should return error if there is password mismatch', async() => {
    const newAccunt = { 
      name: 'James Brown', 
      email: 'james10@example.com', 
      password: '12345',
      confirmPassword: '1234',           
    }
      await request(app).post('/api/v1/auths/account/create').send(newAccunt)
    const {statusCode, body }= await request(app).post('/api/v1/auths/account/create').send(newAccunt)

    expect(statusCode).toEqual(401)
    expect(body.message).toBe('Password mismatch')
    expect(body.status).toBe('fail')

  })

  it('Should login user successfully', async() => {
    //Create user account
    const newAccunt = { 
      name: 'James Brown', 
      email: 'james10@example.com', 
      password: '12345',
      confirmPassword: '12345',           
    }
      await request(app).post('/api/v1/auths/account/create').send(newAccunt)
      
    //login user
    const userLoginDetails = {
      email: 'james10@example.com', 
      password: '12345',
    }
    const {statusCode, body }= await request(app).post('/api/v1/auths/account/login').send(userLoginDetails)

    expect(statusCode).toEqual(200)
    expect(body.message).toBe('Login successful')
    expect(body.status).toBe('Success')
    expect(body.data.name).toBe('James Brown')
    expect(body.data.email).toBe('james10@example.com')
    expect(body.data.balance).toBe(0)    

  })  


  it('Should error if email is incorrect', async() => {
    //Create user account
    const newAccunt = { 
      name: 'James Brown', 
      email: 'james10@example.com', 
      password: '12345',
      confirmPassword: '12345',           
    }
      await request(app).post('/api/v1/auths/account/create').send(newAccunt)
      
    //login user
    const userLoginDetails = {
      email: 'james11@example.com', 
      password: '12345',
    }
    const {statusCode, body }= await request(app).post('/api/v1/auths/account/login').send(userLoginDetails)

    expect(statusCode).toEqual(401)
    expect(body.message).toBe('Invalid Login Details')
    expect(body.status).toBe('fail')
    
  })  

  it('Should error if password is incorrect', async() => {
    //Create user account
    const newAccunt = { 
      name: 'James Brown', 
      email: 'james10@example.com', 
      password: '12345',
      confirmPassword: '12345',           
    }
      await request(app).post('/api/v1/auths/account/create').send(newAccunt)
      
    //login user
    const userLoginDetails = {
      email: 'james10@example.com', 
      password: '123456789',
    }
    const {statusCode, body }= await request(app).post('/api/v1/auths/account/login').send(userLoginDetails)

    expect(statusCode).toEqual(401)
    expect(body.message).toBe('Invalid Login Details')
    expect(body.status).toBe('fail')
    
  })  
})