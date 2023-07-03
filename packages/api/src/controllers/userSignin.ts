import { Request, Response } from "express";
import { User, IUser } from "../models/index.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), "../../.env")
});

type Payload = {
  fullName: string
  email: string
  password: string
}

const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY;

export async function userSignin(req: Request, res: Response) {
    if (!req.body.fullName || !req.body.email || !req.body.password) {
      res.status(204).send("Fill all required fields");
    }
    const { fullName, email, password } = req.body;
    const plain_password: string = password;
    const hashedPassword: string = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')
    
    const existingUser: IUser | null = await User.findOne({ email: email });
    if (existingUser) {
      res.status(409).send("Email Already Exists");
      return;
    }
    
    try {
      const user: IUser = new User({ fullName, email, password: hashedPassword });
      user.save()
        .then(savedUser => {
          console.log('User saved:', savedUser);
          if (JWT_SECRET_KEY === undefined) {
            res.status(500);
            throw new Error("JWT_SECRET NOT FOUND");
          }
          const payload: Payload = {
            fullName: fullName,
            email: email,
            password: plain_password
          }
          const token: string = jwt.sign(payload, JWT_SECRET_KEY);
          res.status(201).send(token);
        })
        .catch(err => {
          console.log('Error saving user:', err);
        });
    } catch (error) {
      console.error(error);
      res.status(503).send("Signin Failed");
    }
}
