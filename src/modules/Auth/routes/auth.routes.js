import { Router } from "express";
import { logout, signin, signup } from "../controllers/auth.controller.js";


const router=Router()

// router.post('/signin',validate(signinSchema),signin)
// router.post('/signup',validate(signupSchema),assertUniqueEmail,signup)
router.post('/signin',signin)

router.post('/signup',signup)
router.post('/logout',logout)
// router.get('/profile',authenticate,GetProfile)

export default router   