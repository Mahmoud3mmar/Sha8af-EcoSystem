import { Router } from "express";
import { authenticate, authorize, checkBlacklist } from "../../Auth/middlewares/auth.middleware.js";
import { AddBranch, deleteBranch, getAllBranches, getBranch, updateBranch } from "../Controllers/Branch.Controller.js";


const router = Router()






router.post(('/'),
    authenticate,
    checkBlacklist,
    authorize("ADMIN"),
    AddBranch
)

router.get(('/'),
    authenticate,
    checkBlacklist,
    authorize("ADMIN"),
    getAllBranches
)
router.get(('/:id'),
    authenticate,
    checkBlacklist,
    authorize("ADMIN"),
    getBranch
)

router.put(('/:id'),
    authenticate,
    checkBlacklist,
    authorize("ADMIN"),
    updateBranch
)

router.delete(('/:id'),
    authenticate,
    checkBlacklist,
    authorize("ADMIN"),
    deleteBranch
)

export default router