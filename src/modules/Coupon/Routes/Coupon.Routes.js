import { Router } from "express";
import { authenticate, authorize, checkBlacklist } from "../../Auth/middlewares/auth.middleware.js";
import { createCoupon } from "../Controllers/Coupon.Controller.js";


const router = Router()






router.post(('/'),
    authenticate,
    checkBlacklist,
    authorize("ADMIN"),
    createCoupon
)



export default router