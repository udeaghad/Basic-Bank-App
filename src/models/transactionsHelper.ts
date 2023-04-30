import db from '../data/db';
import { IDeposit, IWithdraw } from '../interfaces/accountInterface';



export const createDepositTrxns = async(depositInfo: IDeposit) => {
  const[transaction] = await db('trxns')
                               .insert(depositInfo)
                               .then((id: any) => {
                                 return db('trxns')
                                   .whereIn('id',id)
                                   .select()
                               })
  return transaction;
}
export const createWithdrawTrxns = async(withdrawInfo: IWithdraw) => {
  const[transaction] = await db('trxns')
                                .insert(withdrawInfo)
                                .then((id: any) => {
                                  return db('trxns as t')
                                    .join('accts', 't.acct_id', '=', 'accts.id' )
                                    .whereIn('t.id',id)
                                    .select(['t.*', 'accts.name as Sender'])
                                })
  return transaction;
}

export const searchHistory = async(id: String, startDate: String, endDate: String) => {
  const history = await db('trxns as t')
                          .join('accts', 't.acct_id', '=', 'accts.id')
                          .select(['t.*', 'accts.name', 'accts.balance as currentBal'])
                          .where('acct_id', id)
                          .whereRaw("date_format(t.created_at, '%Y-%m-%d') BETWEEN ? AND ?", [startDate, endDate])
                          .orderBy('t.created_at', 'asc')
              
  return history;
}

export const getTransactionDetails = async(id: String) => {
  const [transaction] = await db('trxns')
                              .select()
                              .where('id', id)

  return transaction;
}