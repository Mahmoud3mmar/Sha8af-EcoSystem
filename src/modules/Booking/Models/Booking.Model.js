import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    
    date: {
        type: Date,
        required: true,
    },
    timeFrom: {
        type: String,
        required: true,
    },
    timeTo: {
        type: String,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
    },
    selectedPlan: {
        type: String,
        enum: ['hourly', 'daily', 'monthly'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    finalCharge: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    promoCode: {
        type: String,
    }
}, { timestamps: true });

const BookingModel = mongoose.model('Booking', BookingSchema);

export default BookingModel;
