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

