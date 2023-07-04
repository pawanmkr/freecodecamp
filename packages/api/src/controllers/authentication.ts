import { Request, Response } from "express";
import { User, IUser } from "../models/index.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from "path";
import axios from 'axios';

dotenv.config({
  path: path.join(process.cwd(), "../../.env")
});

type Payload = {
  fullName: string
  email: string
  password: string
}

const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY;


/*
 * User Signup using Form Input 
 */
export async function userSignup(req: Request, res: Response) {
    if (!req.body.fullName || !req.body.email || !req.body.password) {
      res.status(204).send("Fill all required fields");
    }
    const { fullName, email, password } = req.body;
    const plain_password: string = password;
    const hashedPassword: string = hashPassword(plain_password);
    
    const existingUser: IUser | null = await checkIfUserAlreadyExists(email, res);
    if (existingUser) {
      res.status(409).send("Email Already Exists");
      return;
    }

    const user: IUser = new User({ fullName, email, password: hashedPassword });
    await saveUserToDB(user, plain_password, res);
}


/*
 * User Signin using Form Input 
 */
export async function userSignin(req: Request, res: Response) {
    if (!req.body.email || !req.body.password) {
      console.log("Fields: Email and Password are empty\nReturning...")
      res.status(204).send("Email & Password required!");
      return;
    }
    const { email, password } = req.body;
    const plain_password: string = password;
    const hashedPassword: string = hashPassword(plain_password);
    
    const existingUser: IUser | null = await checkIfUserAlreadyExists(email, res);
    if (!existingUser) {
      res.status(404).send(`No User with Email:${email} was found`);
      return;
    }
    if (existingUser.password !== hashedPassword) {
      res.status(404).send("Email or Password is incorrect");
      return;
    }
    const user: IUser = new User({
      fullName: existingUser.fullName,
      email: existingUser.email
    });
    const jwt: string = generateJwt(user, plain_password, res);
    res.status(200).send(jwt);
}





export async function userSigninWithGoogle(req: Request, res: Response) {
  if (!req.body.accessToken) {
    res.status(204).send("Missing Google Credentials");
    return;
  }
  const { accessToken } = req.body;  
  // request for profile details from google account
  try {
    await axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      })
      .then(async (result) => {
        const { name, email } = result.data;

        const existingUser: IUser | null = await checkIfUserAlreadyExists(email, res);
        const password: string = email + JWT_SECRET_KEY?.slice(0, 6);
        const hashedPassword: string = hashPassword(password);
        const user: IUser = new User({ fullName: name, email, password: hashedPassword });
        
        if (existingUser) {
          console.log("Email Already Exists");
          const jwt: string = generateJwt(user, password, res);
          res.status(200).send(jwt);
          return;
        }
        await saveUserToDB(user, password, res);
      }).catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.error("error getting profile", error);
  }
}





// 
function hashPassword(password: string) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex')
}

async function checkIfUserAlreadyExists(email: string, res: Response) {
  const existingUser: IUser | null = await User.findOne({ email: email });
  return existingUser;
}

async function saveUserToDB(user: IUser, plain_password: string, res: Response) {
  try {
    user.save()
      .then(() => {
        const jwt: string = generateJwt(user, plain_password, res);
        res.status(201).send(jwt);
        return;
      })
      .catch(err => {
        console.log('Error saving user:', err);
      });
  } catch (error) {
    console.error(error);
    res.status(503).send("Signin Failed");
  }
}

function generateJwt(user: IUser, plain_password: string, res: Response) {
  if (JWT_SECRET_KEY === undefined) {
    res.status(500);
    throw new Error("JWT_SECRET NOT FOUND");
  }
  const payload: Payload = {
    fullName: user.fullName,
    email: user.email,
    password: plain_password
  }
  return jwt.sign(payload, JWT_SECRET_KEY);
}