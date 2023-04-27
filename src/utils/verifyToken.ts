import {Request, Response, NextFunction} from "express";
import jwt, { Secret } from "jsonwebtoken";

const secretKey: Secret = String(process.env.JWT)

export const verifyToken = (req: Request, res: Response, next: NextFunction) =>{
  const token: string | null = req.cookies.access_token
  if(!token) return {status: 404, message: "You are not authenticated!"}

    jwt.verify(token, secretKey, (err, user) => {
    if(err) return {status: 403, message: "Token is invalid"}
    req.cookies.access_token = user;
    next();
  } )
}
