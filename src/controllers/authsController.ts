import {Request, Response, NextFunction} from "express";
import { create, findAccount} from "../models/accountHelpers";
import { IInfo } from "../interfaces/accountInterface";
import bcrypt from 'bcryptjs';


interface IAccount extends IInfo {
  id: string;
  balance: number;  
}

export const createAccount = async(req:Request, res:Response, next:NextFunction) => {
  const { name, email, password, confirmPassword} = req.body;
  if (password !== confirmPassword) res.status(401).json({message: "Password mismatch"})
  
  const accountExist: null | IAccount= await findAccount(email)
  if(accountExist) res.status(409).json("Account already exist")

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
     
    const response = await create({
      name,
      email,
      password: hash
    })


    if(response) res.status(201).json({message: `Account created successfully`})
    
  } catch (error) {
    next(error)
  }
}