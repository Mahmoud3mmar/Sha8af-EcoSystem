import { Router } from "express";
import { authenticate, authorize, checkBlacklist } from "../../Auth/middlewares/auth.middleware.js";
import { upload } from "../../../MiddleWares/Upload.middleware.js";
import { AddRoom, DeleteRoom, GetRooms, UpdateRoom } from "../Controllers/Room.controller.js";


const router = Router()






router.post(('/:id'),
    authenticate,
    checkBlacklist,
    authorize("ADMIN"),
    upload.single("image"),
    AddRoom
)

router.get(('/:id'),
    authenticate,
    checkBlacklist,
    authorize("ADMIN"),
    GetRooms
)


router.put(('/:id'),
    authenticate,
    checkBlacklist,
    authorize("ADMIN"),
    UpdateRoom
)

router.delete(('/:id'),
    authenticate,
    checkBlacklist,
    authorize("ADMIN"),
    DeleteRoom
)

export default router