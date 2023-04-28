import {Request, Response, NextFunction} from "express";
import axios from "axios";
import qs from 'qs'
import { updateBalanceOnDeposit, updateBalanceOnWithdraw } from "../models/accountHelpers";
import { createDepositTrxns, createWithdrawTrxns, searchHistory } from "../models/transactionsHelper";

export const receiveDeposit = async(req: Request, res: Response, next: NextFunction) => {

  const { id, amount, remarks, ...otherInfo } = req.body

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

     const { balance, currentBal, ...otherDepositInfo} = createTrxns; 

    if(!createTrxns) return res.status(400).json({status: 'fail', message: "Transaction not completed", data: null})
    
    res.status(200).json({status: 'Success', message: 'Transactions Successful', data: otherDepositInfo})
  
  } catch (error) {
    next(error)
  }

}

export const sendMoney = async(req: Request, res: Response, next: NextFunction) => {
 
  const { id, amount, remarks, ...otherInfo } = req.body
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
      
    const data = qs.stringify({
      amount,       
      'narration': `Transfer from ${createTrxns.Sender}`,
      ...otherInfo
    });
    const config = {
      method: 'post',
      url: 'https://integrations.getravenbank.com/v1/transfers/create',
      headers: { 
        Authorization: 'Bearer RVSEC-TESTa719c38c54953cd5de4c2a98b2fbee273988420b5a917193658020fc6077fca77f801665fd852fc0eabb7229cf8ce23a-1682653183722'
      },
      data : data
    };
    
    axios(config)
    .then((response: any) => {
      // console.log(JSON.stringify(response.data));
      res.status(200).json(response.data)
    })
    .catch((error: any) => {
      console.log(error);
             
    });

  } catch (error) {
    next(error)
  }
}

export const searchTrxnsHistory = async(req: Request, res: Response, next: NextFunction) => {
  const { id, startDate, endDate } = req.body;
  
  try {
    
    if(!startDate) return res.status(400).send("You need to enter the startDate and endDate in the query")
  
    const report =  await searchHistory(id, startDate, endDate)
  
    res.status(200).json({ status: 'Success', message: 'Transaction Successful', data: report})
  } catch (error) {
    next(error)
  }
  
}