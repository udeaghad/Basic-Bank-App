import db from "../data/db";
import { IDeposit, IWithdraw } from "../interfaces/accountInterface";



export const createDepositTrxns = async(depositInfo: IDeposit) => {
  const[id] = await db("trxns")
                .insert(depositInfo)
                .then((id: any) => {
                  return db("trxns")
                    .whereIn('id',id)
                    .select()
                })
  return id;
}
export const createWithdrawTrxns = async(withdrawInfo: IWithdraw) => {
  const[id] = await db("trxns")
                .insert(withdrawInfo)
                .then((id: any) => {
                  return db("trxns")
                    .whereIn('id',id)
                    .select()
                })
  return id;
}

export const searchHistory = async(id: string, startDate: string, endDate: string) => {
  const history = await db("trxns as t")
                  .join("accts", "t.acct_id", "=", "accts.id")
                  .select(["t.*", "accts.name", "accts.balance as currentBal"])
                  .where("acct_id", id)
                  .whereRaw("date_format(t.created_at, '%Y-%m-%d') BETWEEN ? AND ?", [startDate, endDate])
                  .orderBy('t.created_at', 'asc')
              
  return history;
}