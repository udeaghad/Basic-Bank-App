import request from 'supertest';
import Knex from 'knex';
import app from '../../app';

describe('Transactions', () => {
  
  afterEach(() => {
    let config = require('../../../knexfile')
      let db = Knex(config.test)
    db.destroy()
  })
    
    let accountNumber: string;
    let cookies: string[];
    
      beforeAll(async() => {
    
        //Create an account to obtain account id
    
        const newAccunt = { 
          name: 'James Brown', 
          email: 'james10@example.com', 
          password: '12345',
          confirmPassword: '12345',              
        }
          await request(app).post('/api/v1/auths/account/create').send(newAccunt)
    
        //login
    
         const userLoginDetails = {
          email: 'james10@example.com', 
          password: '12345',
        }
    
        const res= await request(app).post('/api/v1/auths/account/login').send(userLoginDetails)
    
        accountNumber = res.body.data.id
        cookies = res.get('Set-Cookie')
        
      })
  
  
  
  

  describe('Receive Deposit', () => {

    it('should accept deposit successfully', async() => {
      
      const depositDetails = {
        id: accountNumber,
        amount:"2500",
        remarks:"Deposit by self",
        bank_code: "044",
        bank: "Fidelity bank",
        account_number: "0000809031",
        account_name: "Chris Olodo",
        reference: "52546874",
        currency: "NGN"
      }
  
      const {statusCode, body} = await request(app)
                                  .post('/api/v1/accounts/deposit/receiveMoney')
                                  .send(depositDetails)
                                  .set('Authorization', 'Bearer 12345')
      
      expect(statusCode).toBe(200)
      expect(body.status).toBe("Success")
      expect(body.message).toBe('Transactions Successful')
      expect(body.data.deposit).toBe(2500)
      expect(body.data.withdraw).toBe(0)
      expect(body.data.remarks).toBe('Deposit by self')
      expect(body.data.remarks).toBe('Deposit by self')
      expect(body.data.acct_id).toBe(accountNumber)
      expect(body.data.bank_code).toBe(44)
      expect(body.data.bank).toBe('Fidelity bank')
      expect(body.data.currency).toBe('NGN')
  
    })
  
    it('should return error if authentication is missing the key word \'Bearer\' while receiving a deposit', async() => {
      
      const depositDetails = {
        id: accountNumber,
        amount:"2500",
        remarks:"Deposit by self",
        bank_code: "044",
        bank: "Fidelity bank",
        account_number: "0000809031",
        account_name: "Chris Olodo",
        reference: "52546874",
        currency: "NGN"
      }
  
      const {statusCode, body} = await request(app)
                                  .post('/api/v1/accounts/deposit/receiveMoney')
                                  .send(depositDetails)
                                  .set('Authorization', '12345')
  
      expect(statusCode).toBe(400)
      expect(body.status).toBe("fail")
      expect(body.message).toBe('Invalid token')    
  
    })
  
    it('should return error if authentication is incorrect while receiving a deposit', async() => {
      
      const depositDetails = {
        id: accountNumber,
        amount:"2500",
        remarks:"Deposit by self",
        bank_code: "044",
        bank: "Fidelity bank",
        account_number: "0000809031",
        account_name: "Chris Olodo",
        reference: "52546874",
        currency: "NGN"
      }
  
      const {statusCode, body} = await request(app)
                                  .post('/api/v1/accounts/deposit/receiveMoney')
                                  .send(depositDetails)
                                  .set('Authorization', 'Bearer 123456')
  
      expect(statusCode).toBe(400)
      expect(body.status).toBe("fail")
      expect(body.message).toBe('Invalid token')    
  
    })
  
    it('should return error if authentication is missing while receiving a deposit', async() => {
      
      const depositDetails = {
        id: accountNumber,
        amount:"2500",
        remarks:"Deposit by self",
        bank_code: "044",
        bank: "Fidelity bank",
        account_number: "0000809031",
        account_name: "Chris Olodo",
        reference: "52546874",
        currency: "NGN"
      }
  
      const {statusCode, body} = await request(app)
                                  .post('/api/v1/accounts/deposit/receiveMoney')
                                  .send(depositDetails)
  
      expect(statusCode).toBe(400)
      expect(body.status).toBe("fail")
      expect(body.message).toBe('Invalid token')    
  
    })
  })

  describe('Send Transfer', () => {
    it('Should send transfer successfully', async() => {
      const transferDetails = {
        "id": accountNumber,
        "amount":"10",
        "remarks":"Trf to Clark",
        "bank_code": "044",
        "bank": "Access bank",
        "account_number": "0690000031",
        "account_name": "Pastor Bright",
        "reference": "9967998",
        "currency" : "NGN"
      }

      const {statusCode} = await request(app)
                                  .post('/api/v1/accounts/withdraw/sendMoney')
                                  .send(transferDetails)
                                  .set('Cookie', cookies)
      expect(statusCode).toBe(200)
      
    })    

    it('Should return error if amount is higher than user\'s balance', async() => {
      const transferDetails = {
        "id": accountNumber,
        "amount":"20000",
        "remarks":"Trf to Clark",
        "bank_code": "044",
        "bank": "Access bank",
        "account_number": "0690000031",
        "account_name": "Pastor Bright",
        "reference": "9967998",
        "currency" : "NGN"
      }

      const {statusCode, body} = await request(app)
                                  .post('/api/v1/accounts/withdraw/sendMoney')
                                  .send(transferDetails)
                                  .set('Cookie', cookies)
                                  
      expect(statusCode).toBe(400)
      expect(body.status).toBe('fail')
      expect(body.message).toBe('Insufficient balance')
    })    
  })

    describe('Transaction History', () => {

      it('Should get transaction details', async() => {
        const depositDetails = {
          id: accountNumber,
          amount:"2500",
          remarks:"Deposit by self",
          bank_code: "044",
          bank: "Fidelity bank",
          account_number: "0000809031",
          account_name: "Chris Olodo",
          reference: "52546874",
          currency: "NGN"
        }
    
        const response = await request(app)
                                    .post('/api/v1/accounts/deposit/receiveMoney')
                                    .send(depositDetails)
                                    .set('Authorization', 'Bearer 12345')

        const {statusCode, body} = await request(app)
                                   .get(`/api/v1/accounts/${accountNumber}/transaction/${response.body.id}`)
                                   .set('Cookie', cookies)
        expect(statusCode).toBe(200)

      })

      it('Should get transaction history by dates', async() => {
        const depositDetails1 = {
          id: accountNumber,
          amount:2500,
          remarks:"Deposit by self",
          bank_code: "044",
          bank: "Fidelity bank",
          account_number: "0000809031",
          account_name: "Chris Olodo",
          reference: "52546874",
          currency: "NGN",
          created_at: '2023-01-01'
        }
        const depositDetails2 = {
          id: accountNumber,
          amount:500,
          remarks:"Deposit by self",
          bank_code: "044",
          bank: "Fidelity bank",
          account_number: "0000809031",
          account_name: "Chris Olodo",
          reference: "52546874",
          currency: "NGN",
          created_at: '2023-02-01'
        }
        const depositDetails3 = {
          id: accountNumber,
          amount: 1000,
          remarks:"Deposit by self",
          bank_code: "044",
          bank: "Fidelity bank",
          account_number: "0000809031",
          account_name: "Chris Olodo",
          reference: "52546874",
          currency: "NGN",
          created_at: '2023-03-01'
        }
    
        await request(app)
          .post('/api/v1/accounts/deposit/receiveMoney')
          .send(depositDetails1)
          .set('Authorization', 'Bearer 12345')

        await request(app)
          .post('/api/v1/accounts/deposit/receiveMoney')
          .send(depositDetails2)
          .set('Authorization', 'Bearer 12345')

        await request(app)
          .post('/api/v1/accounts/deposit/receiveMoney')
          .send(depositDetails3)
          .set('Authorization', 'Bearer 12345')


        const searchParam = {
          id: accountNumber,
          startDate: '2023-02-01',
          endDate: '2023-03-01'
        }

        const {statusCode, body} = await request(app)
                                   .post(`/api/v1/accounts/history`)
                                   .set('Cookie', cookies)
                                   .send(searchParam)
        expect(statusCode).toBe(200)
        expect(body.data).toHaveLength(2)
        expect(body.data[0].deposit).toBe(depositDetails2.amount)
        expect(body.data[1].deposit).toBe(depositDetails3.amount)

      })

    })

})