import {Request, Response, NextFunction} from "express";
import jwt, {Secret} from 'jsonwebtoken';
import { create, findAccount} from "../models/accountHelpers";
import { IInfo } from "../interfaces/accountInterface";
import bcrypt from 'bcryptjs';


interface IAccount extends IInfo {
  id: string;
  balance: number;  
}

const secretKey: Secret = String(process.env.JWT);

export const createAccount = async(req:Request, res:Response, next:NextFunction) => {
  const { name, email, password, confirmPassword} = req.body;
  if (password !== confirmPassword) res.status(401).json({message: "Password mismatch"})
  
  const accountExist: null | IAccount= await findAccount(email)
  if(accountExist) return res.status(409).json("Account already exist")

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
     
    const response = await create({
      name,
      email,
      password: hash
    })


    if(response) res.status(201).json({status: "Success", message: `Account ${response} created successfully`})
    
  } catch (error) {
    next(error)
  }
}

export const login = async(req: Request, res: Response, next: NextFunction) => {

  const accountExist: null | IAccount= await findAccount(req.body.email)

  if(!accountExist) return res.status(401).json({ status: 'fail', message: "Invalid Login Details" })

  if(accountExist) {
    try {
      const { id, password, ...otherDetails} = accountExist;
      
      const validPassword = await bcrypt.compare(req.body.password, password);
      if(!validPassword) return res.status(401).json({status: "fail", message: "Invaid Login Details"})

      const token = jwt.sign({id}, secretKey)

      res
        .cookie("access_token", token, { httpOnly: true, sameSite: "none", secure: true })
        .status(200)
        .json({id, ...otherDetails})
    } catch (error) {
      next(error)
    }
  }
}