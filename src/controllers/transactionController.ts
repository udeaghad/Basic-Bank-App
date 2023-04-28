import {Request, Response, NextFunction} from "express";
import { updateBalanceOnDeposit, updateBalanceOnWithdraw } from "../models/accountHelpers";
import { createDepositTrxns, createWithdrawTrxns, searchHistory } from "../models/transactionsHelper";

export const receiveDeposit = async(req: Request, res: Response, next: NextFunction) => {
  
  const { id, amount, remarks } = req.body

  const updatedBalance = await updateBalanceOnDeposit(id, amount);
  
  const createTrxns = await createDepositTrxns({
    deposit: amount,
    balance: updatedBalance.balance,
    acct_id: id,
    remarks,
  })

  if(createTrxns) return res.status(200).json(createTrxns)
}

export const sendMoney = async(req: Request, res: Response, next: NextFunction) => {
 
  const { id, amount, remarks } = req.body

  const updatedBalance = await updateBalanceOnWithdraw(id, amount);
  
  const createTrxns = await createWithdrawTrxns({
    withdraw: amount,
    balance: updatedBalance.balance,
    acct_id: id,
    remarks,
  })

  if(createTrxns) return res.status(200).json(createTrxns)
}

export const searchTrxnsHistory = async(req: Request, res: Response, next: NextFunction) => {
  const { id, startDate, endDate } = req.body;
  
  try {
    
    if(!startDate) return res.status(400).send("You need to enter the startDate and endDate in the query")
  
    const report =  await searchHistory(id, startDate, endDate)
  
    res.status(200).json(report)
  } catch (error) {
    next(error)
  }
  
}