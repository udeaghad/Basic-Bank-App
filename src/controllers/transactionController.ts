import {Request, Response, NextFunction} from "express";
import { updateBalanceOnDeposit, updateBalanceOnWithdraw } from "../models/accountHelpers";
import { createDepositTrxns, createWithdrawTrxns } from "../models/transactionsHelper";

export const createDeposit = async(req: Request, res: Response, next: NextFunction) => {
  
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

export const createWithdraw = async(req: Request, res: Response, next: NextFunction) => {
 
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