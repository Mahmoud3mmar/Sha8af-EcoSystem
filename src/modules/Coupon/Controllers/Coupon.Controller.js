import { AppError, catchAsyncError } from "../../../utils/error.handler.js";
import CouponModel from "../Models/Coupon.Model.js";



const createCoupon = catchAsyncError(async (req, res) => {
    const { promoCode, discountPercentage, expiryDate, maxUsage } = req.body;

    // Validate required fields
    if (!promoCode || !discountPercentage || !expiryDate) {
        throw new AppError('All fields are required', 400);
    }

    // Create coupon
    const coupon = await CouponModel.create({ promoCode, discountPercentage, expiryDate, maxUsage });
    
    res.status(201).json({ message: 'Coupon created successfully', coupon });
});


export {
    createCoupon
}