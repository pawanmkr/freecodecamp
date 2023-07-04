import { Router } from 'express';
import { 
  userSignin, 
  userSigninWithGoogle, 
  getCourses 
} from '../controllers/index.js'

export const router = Router();

router.post("/user/signin", userSignin);
router.post("/user/signin/google", userSigninWithGoogle);
router.get("/courses", getCourses);