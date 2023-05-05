import {Request, Response, NextFunction} from 'express';
import axios from 'axios';
import qs from 'qs'
import { checkBalance, updateBalanceOnDeposit, updateBalanceOnWithdraw } from '../models/accountHelpers';
import { createDepositTrxns, createWithdrawTrxns, getTransactionDetails, searchHistory } from '../models/transactionsHelper';
import { IDeposit, IWithdraw } from '../interfaces/accountInterface';


const webhookURL = String(process.env.WEBHOOK_URL)

export const receiveDeposit = async(req: Request, res: Response, next: NextFunction) => {
 
  const { id, amount, remarks, bank_code, bank, account_number, account_name, reference, currency } = req.body

  const authorization = req.headers.authorization?.split(' ')[1]
  const tokenSuffix = req.headers.authorization?.split(' ')[0]

  if(authorization !== '12345' || authorization?.length !== 5 || tokenSuffix !== 'Bearer' ) {
    return res.status(400).json({status: 'fail', message: 'Invalid token'})
  } 

  try {
    
    const updatedBalance = await updateBalanceOnDeposit(id, amount);
  
    if(!updatedBalance) return res.status(400).json({status: 'fail', message: 'Balance could not be updated'})
  
    const createTrxns: IDeposit = await createDepositTrxns({
      deposit: amount,
      balance: updatedBalance.balance,
      acct_id: id,
      remarks, 
      bank_code, 
      bank, 
      account_number, 
      account_name, 
      reference, 
      currency,
    })
    
    if(!createTrxns) return res.status(400).json({status: 'fail', message: 'Transaction not completed', data: null})
    
    const { balance, currentBal, ...otherDepositInfo} = createTrxns; 
     
    const responseMessage = {
      status: 'Success', 
      message: 'Transactions Successful', 
      data: otherDepositInfo 
    }
    
    try {
       await axios.post(webhookURL, responseMessage)
  
    } catch (error: any) {
      next(error)
    }

    res.status(200).json(responseMessage)
  
  } catch (error) {
    next(error)
  }

}

export const sendMoney = async(req: Request, res: Response, next: NextFunction) => {  
 
  const { id, amount, remarks, bank_code, bank, account_number, account_name, reference, currency } = req.body
  
  if(Number(req.cookies.access_token.id) !== Number(id)) return res.status(401).json({status: 'Unauthorized', message: 'You are not authorized performing transaction'})
  
  try {
    const checkedAccountBalance: { balance: number } = await checkBalance(id)
     
    if(Number(checkedAccountBalance.balance) < Number(amount) ) return res.status(400).json({status: 'fail', message: 'Insufficient balance', data: null})
    
    const updatedBalance = await updateBalanceOnWithdraw(id, amount);
    
    if(!updatedBalance) return res.status(400).json({status: 'fail', message: 'Balance could not be updated', data: null})
    
    
    const createTrxns: IWithdraw = await createWithdrawTrxns({
      withdraw: amount,
      balance: updatedBalance.balance,
      acct_id: id,
      remarks,
      bank_code, 
      bank, 
      account_number, 
      account_name, 
      reference, 
      currency,
    })
  
    if(!createTrxns) return res.status(400).json({status: 'fail', message: 'Transaction not complete', data: null})

    const { balance, currentBal, ...otherDepositInfo} = createTrxns;

    const responseMessage = {
      status: 'Pending', 
      message: 'Transactions Pending', 
      data: otherDepositInfo 
    }
    
    try {
      await axios.post(webhookURL, responseMessage)
  
    } catch (error: any) {
      next(error)
    }
      
    const data = qs.stringify ({
      amount,       
      'narration': `Transfer from ${createTrxns.Sender}`,
      bank_code, 
      bank, 
      account_number, 
      account_name, 
      reference, 
      currency,
    });

  
      const config = {
      method: 'post',
      url: 'https://integrations.getravenbank.com/v1/transfers/create',
      headers: {         
        'Authorization': process.env.RAVEN_SECRET        
      },
      data : data
    };
    
    const ravenResponse = await axios(config)
      .then((response: any) => {
        return (JSON.stringify(response.data)); 
      })
      .catch((error: any) => {
        console.log(error)
        next(error)             
      });

    // axios.post(webhookURL, ravenResponse)
    res.status(200).json(ravenResponse)

  } catch (error) {
    next(error)
  }
}

export const searchTrxnsHistory = async(req: Request, res: Response, next: NextFunction) => {
  
  const { id, startDate, endDate } = req.body;

  if(Number(req.cookies.access_token.id) !== Number(id)) return res.status(401).json({status: 'Unauthorized', message: 'You need to login before performing transaction'})
  
  try {
    
    if(!startDate) return res.status(400).send('You need to enter the startDate')
    if(!endDate) return res.status(400).send('You need to enter the endDate')
    
    const report =  await searchHistory(id, startDate, endDate)
  
    res.status(200).json({ status: 'Success', message: 'Transaction Successful', data: report})
  } catch (error) {
    next(error)
  }
  
}

export const getTransaction = async(req: Request, res: Response, next: NextFunction) => {
  
  const {id, trxns_id } = req.params

  if(Number(req.cookies.access_token.id) !== Number(id)) return res.status(401).json({status: 'Unauthorized', message: 'You need to login before performing transaction'})

  try {
    const transaction = await getTransactionDetails(trxns_id)
   
    res.status(200).json({status: 'Success', message: 'Transaction Successfull1', data: transaction})
    
  } catch (error) {
    next(error)
  }

}