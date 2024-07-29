import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true


    },
    countryCode: {
        type: String,
        required: true


    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,



    },
    role: {
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER",
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile'
    },






}, { timestamps: true })

const UserModel = mongoose.model('User', UserSchema)


export default UserModel