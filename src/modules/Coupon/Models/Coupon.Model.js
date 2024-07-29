// models/Coupon.model.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    promoCode: {
        type: String,
        required: true,
        unique: true, // Ensure coupon codes are unique
        trim: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0, // Minimum discount percentage
        max: 100 // Maximum discount percentage
    },
    expiryDate: {
        type: Date,
        required: true
    },
    maxUsage: {
        type: Number,
        default: 1 // Maximum times the coupon can be used
    },
    currentUsage: {
        type: Number,
        default: 0 // Current usage count
    },
    isActive: {
        type: Boolean,
        default: true // Whether the coupon is active
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt timestamps
});

const CouponModel = mongoose.model('Coupon', couponSchema);

export default CouponModel;
