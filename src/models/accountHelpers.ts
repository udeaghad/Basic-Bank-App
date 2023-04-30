import db from '../data/db';
import { IInfo } from '../interfaces/accountInterface';

export const create = async(info: IInfo) => {
  const [id] = await db('accts')
                    .insert(info)
                    .select(['id'])
  return id;  
}

export const findAccount = async(email: String) => {
  const [account] = await db('accts')
                            .where({email})
                            .select();

   return account
}

export const updateBalanceOnDeposit = async(id: String, amount: Number) => {
  const [account] = await db('accts')
                          .where({id})
                          .update({
                            'balance': db.raw(`balance + ${amount}`)
                          })
                          .then(() => {
                            return db('accts')
                              .where({id})
                              .select(['balance'])
                          })
  return account
}

export const updateBalanceOnWithdraw = async(id: string, amount: number) => {
  const [account] = await db('accts')
                          .where({id})
                          .update({
                            'balance': db.raw(`balance - ${amount}`)
                          })
                          .then(() => {
                            return db('accts')
                              .where({id})
                              .select(['balance'])
                          })
  return account
}

export const checkBalance = async(id: string) => {
  const [balance] = await db('accts')
                          .where({id})
                          .select(['balance'])
  
  return balance;
}