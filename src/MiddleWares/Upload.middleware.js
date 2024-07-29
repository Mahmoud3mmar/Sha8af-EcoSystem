import multer from "multer"

import { v4 as uuidv4 } from 'uuid';
import { AppError } from "../utils/error.handler.js";

// import {storage} from "../utils/mutler.config.js"
import path from "path";
import { cloudinary } from "../utils/Cloudinary.config.js";

// const fileFilter = (req, file, cb) => {
//   if (!file.mimetype.startsWith('image')) {
//     return cb(new AppError('Images Only!!!', 400), false);
//   }
//   cb(null, true);
// };
// const storage= multer.diskStorage({ 
//     destination:(req,file,cb)=>{
//         cb(null,'images')
//     },
//     filename:(req,file,cb)=>{
//         console.log(file)
//        cb(null,Date.now()+path.extname(file.originalname))     
//     }
// })


const storage = multer.diskStorage({

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})



export const upload = multer({ storage: storage });
