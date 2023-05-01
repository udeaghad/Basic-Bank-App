import {Request, Response, NextFunction} from 'express';
import jwt, {Secret} from 'jsonwebtoken';
import { create, findAccount} from '../models/accountHelpers';
import { IInfo } from '../interfaces/accountInterface';
import bcrypt from 'bcryptjs';
import hashPassword from '../utils/hashPassword';


interface IAccount extends IInfo {
  id: string;
  balance: number;  
}

const secretKey: Secret = String(process.env.JWT);

export const createAccount = async(req:Request, res:Response, next:NextFunction) => {
  const { name, email, password, confirmPassword} = req.body;
  if (password !== confirmPassword) return res.status(401).json({status: 'fail', message: 'Password mismatch'})
  
  const accountExist: null | IAccount= await findAccount(email)
  if(accountExist) return res.status(409).json({status: 'Success', message: 'Account already exist'})

  try {
     
    const response = await create({
      name,
      email,
      password: hashPassword(password)
    })


    if(response) res.status(201).json({status: 'Success', message: `Account created successfully`})
    
  } catch (error) {
    next(error)
  }
}

export const login = async(req: Request, res: Response, next: NextFunction) => {

  const accountExist: null | IAccount= await findAccount(req.body.email)

  if(!accountExist) return res.status(401).json({ status: 'fail', message: 'Invalid Login Details' })

  if(accountExist) {
    try {
      const { id, password, ...otherDetails} = accountExist;
      
      const validPassword = await bcrypt.compare(req.body.password, password);
      if(!validPassword) return res.status(401).json({status: 'fail', message: 'Invalid Login Details'})

      const token = jwt.sign({id}, secretKey)

      res
        .cookie('access_token', token, { httpOnly: true, sameSite: 'none', secure: true })
        .status(200)
        .json({ status: 'Success', message: 'Login successful', data: {id, ...otherDetails}})
    } catch (error) {
      next(error)
    }
  }
}