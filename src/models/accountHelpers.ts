import db from '../data/db';
import { IInfo } from '../interfaces/accountInterface';

export const create = async(info: IInfo) => {
  const [id] = await db("accts").insert(info)
  return id;  
}

export const findAccount = async(email: string) => {
  const [account] = await db("accts")
                            .where({email})
                            .select();

   return account
}
