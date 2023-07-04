import { Router } from 'express';
import { 
  userSignin, 
  userSignup,
  userSigninWithGoogle, 
  getCourses 
} from '../controllers/index.js'
import authorization from '../middlewares/auth.js';

export const router = Router();

router.post("/user/signin", userSignin);
router.post("/user/signup", userSignup);
router.post("/user/signin/google", userSigninWithGoogle);

router.get("/courses", authorization, getCourses);