import bcrypt from 'bcrypt'


import { AppError, catchAsyncError } from "../../../utils/error.handler.js";
import UserModel from '../../User/Models/user.model.js';
import jwt from 'jsonwebtoken';
import { TokenBlacklistModel } from '../Models/TokenBlacklist.Model.js';
import UserProfileModel from '../../User/Models/userprofile.model.js';
import { validatePhoneNumber } from '../../../utils/PhoneNumber.js';








const signin = catchAsyncError(async (req, res) => {

    const { phone, password } = req.body
    const existeduser = await UserModel.findOne({ phone })

    if (!existeduser || !bcrypt.compareSync(password, existeduser.password)) throw new AppError('Invalid credentials', 400)

    const { _id: id ,name ,role} = existeduser

    // Generate access token
    const token = jwt.sign({id,name,role }, process.env.SECRET, { expiresIn: '1h' })

    

   
    res.status(201).json({ token ,message: 'Signed in successfully ..' })
})

const signup = catchAsyncError(async (req, res) => {
    const { name, countryCode, phone, password,role  } = req.body;

    // Validate that required fields are present
    if (!name || !countryCode || !phone || !password) {
        throw new AppError('Please provide all required fields', 400);
    }
    // Validate the phone number
    if (!validatePhoneNumber(phone, countryCode)) {
        throw new AppError('Invalid phone number for the specified country', 400);
    }
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
        throw new AppError('User with this phone number already exists', 409);

    }

  

    // Hash the password
    const hashedpassword = bcrypt.hashSync(password, Number(process.env.SALT));

    // Create the user
    const user = await UserModel.create({
        name,
        countryCode,
        phone,
        password: hashedpassword,
        role
    });

       // Create the user profile with userId reference
       const userProfile = await UserProfileModel.create({ userId: user._id });
    // Update the user with the new profile ID
    await UserModel.findByIdAndUpdate(user._id, { $push: { profile: userProfile._id } });

    res.status(201).json({ message: 'Signed up successfully ..' });
});

const logout = catchAsyncError(async (req, res) => {
    const token = req.header('token')

    if (!token) {
        throw new AppError('No token provided', 400);
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.SECRET);

    // Log the decoded token to check its content
    console.log('Decoded token:', decoded);

    // Ensure the exp field is present and valid
    if (!decoded.exp) {
        throw new AppError('Invalid token, no expiration time', 400);
    }

    const expirationTime = new Date(decoded.exp * 1000);

    // Log the expiration time to check its value
    console.log('Expiration time:', expirationTime);

    if (isNaN(expirationTime)) {
        throw new AppError('Invalid expiration time', 400);
    }

    await TokenBlacklistModel.create({
        token,
        expiresAt: expirationTime
    });

    res.status(200).json({ message: 'Logged out successfully ..' });
});

export {
    signin,
    signup,
    logout,
}