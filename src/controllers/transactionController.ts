import {Request, Response, NextFunction, response} from "express";
import axios from "axios";
import qs from 'qs'
import { updateBalanceOnDeposit, updateBalanceOnWithdraw } from "../models/accountHelpers";
import { createDepositTrxns, createWithdrawTrxns, searchHistory } from "../models/transactionsHelper";

const webhookURL = 'https://webhook.site/95291e4d-e5c6-4470-9ee5-a8eeb460b347'

export const receiveDeposit = async(req: Request, res: Response, next: NextFunction) => {
 
  const { id, amount, remarks, ...otherInfo } = req.body

  const authorization = req.headers.authorization?.split(' ')[1]
  const tokenSuffix = req.headers.authorization?.split(' ')[0]

  if(authorization !== '12345' || authorization?.length !== 5 || tokenSuffix !== 'Bearer' ) {
    return res.status(400).json({status: 'fail', message: "Invalid token"})
  } 

  try {
    
    const updatedBalance = await updateBalanceOnDeposit(id, amount);
  
    if(!updatedBalance) return res.status(400).json({status: 'fail', message: "Balance could not be updated"})
  
    const createTrxns = await createDepositTrxns({
      deposit: amount,
      balance: updatedBalance.balance,
      acct_id: id,
      remarks,
      ...otherInfo
    })
    
    if(!createTrxns) return res.status(400).json({status: 'fail', message: "Transaction not completed", data: null})
    
    const { balance, currentBal, ...otherDepositInfo} = createTrxns; 
     
    const responseMessage = {
      status: 'Success', 
      message: 'Transactions Successful', 
      data: otherDepositInfo 
    }
    
    try {
       await axios.post(webhookURL, responseMessage)
  
    } catch (error: any) {
      throw Error(error)
    }

    res.status(200).json(responseMessage)
  
  } catch (error) {
    next(error)
  }

}

export const sendMoney = async(req: Request, res: Response, next: NextFunction) => {  
 
  const { id, amount, remarks, ...otherInfo } = req.body

  if(req.cookies.access_token.id !== id) return res.status(401).json({status: 'Unauthorized', message: "You need to login before performing transaction"})

  try {
    
    const updatedBalance = await updateBalanceOnWithdraw(id, amount);
    
    if(!updatedBalance) return res.status(400).json({status: 'fail', message: "Balance could not be updated", data: null})
    
    const createTrxns = await createWithdrawTrxns({
      withdraw: amount,
      balance: updatedBalance.balance,
      acct_id: id,
      remarks,
      ...otherInfo
    })
  
    if(!createTrxns) return res.status(400).json({status: 'fail', message: "Transaction not complete", data: null})

    const { balance, currentBal, ...otherDepositInfo} = createTrxns;

    const responseMessage = {
      status: 'Pending', 
      message: 'Transactions Pending', 
      data: otherDepositInfo 
    }
    
    try {
      await axios.post(webhookURL, responseMessage)
  
    } catch (error: any) {
      throw Error(error)
    }
      
    const data = qs.stringify({
      amount,       
      'narration': `Transfer from ${createTrxns.Sender}`,
      ...otherInfo
    });

      const config = {
      method: 'post',
      url: 'https://integrations.getravenbank.com/v1/transfers/create',
      headers: {         
        'Authorization': process.env.RAVEN_SECRET        
      },
      data : data
    };
    
    axios(config)
    .then((response: any) => {
      // console.log(JSON.stringify(response.data));
      
      res.status(200).json(response.data)
    })
    .catch((error: any) => {
      next(error)
             
    });

  } catch (error) {
    next(error)
  }
}

export const searchTrxnsHistory = async(req: Request, res: Response, next: NextFunction) => {

  const { id, startDate, endDate } = req.body;

  if(req.cookies.access_token.id !== id) return res.status(401).json({status: 'Unauthorized', message: "You need to login before performing transaction"})
  
  try {
    
    if(!startDate) return res.status(400).send("You need to enter the startDate")
    if(!endDate) return res.status(400).send("You need to enter the endDate")
    
    const report =  await searchHistory(id, startDate, endDate)
  
    res.status(200).json({ status: 'Success', message: 'Transaction Successful', data: report})
  } catch (error) {
    next(error)
  }
  
}