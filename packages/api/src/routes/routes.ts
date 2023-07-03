import { Router } from 'express';
import { userSignin } from '../controllers/index.js'

export const router = Router();

router.post("/user/signin", userSignin);