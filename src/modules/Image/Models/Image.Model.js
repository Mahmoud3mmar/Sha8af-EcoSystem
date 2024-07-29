import mongoose from "mongoose";


const imageSchema = new mongoose.Schema({


    name: String,
    url: String,
    cloudinary_id: String,
    



})



const imageModel = mongoose.model('image', imageSchema)


export default imageModel