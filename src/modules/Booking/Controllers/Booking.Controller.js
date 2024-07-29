import { AppError, catchAsyncError } from "../../../utils/error.handler.js";
import CouponModel from "../../Coupon/Models/Coupon.Model.js";
import RoomModel from "../../Room/Models/Room.Model.js";
import BookingModel from "../Models/Booking.Model.js";


const validateBookingFields = (fields) => {
    const { date, timeFrom, timeTo, seats, selectedPlan } = fields;
    if (!date || !timeFrom || !timeTo || !seats || !selectedPlan) {
        throw new AppError('All fields are required', 400);
    }
};

const calculateBaseCharge = (selectedPlan, room, timeFrom, timeTo, seats) => {
    let baseCharge;
    switch (selectedPlan) {
        case "hourly":
            const hours = (new Date(`1970-01-01T${timeTo}Z`) - new Date(`1970-01-01T${timeFrom}Z`)) / 3600000;
            baseCharge = room.plans.hourly * hours * seats;
            break;
        case 'daily':
            baseCharge = room.plans.daily * seats;
            break;
        case 'monthly':
            baseCharge = room.plans.monthly * seats;
            break;
        default:
            throw new AppError('Invalid plan selected', 400);
    }
    return baseCharge;
};

const applyPromoCode = async (promoCode, baseCharge) => {
    let finalCharge = baseCharge;
    let promo = null;
    if (promoCode) {
        promo = await CouponModel.findOne({ promoCode: promoCode, expiryDate: { $gt: new Date() } });
        if (!promo) {
            throw new AppError('Invalid or expired promo code', 400);
        }
        finalCharge -= (promo.discountPercentage / 100) * baseCharge;
    }
    return { finalCharge, promo };
};

const createBooking = catchAsyncError(async (req, res) => {
    const { date, timeFrom, timeTo, seats, selectedPlan, promoCode } = req.body;
    const userId = req.user.id;
    const roomId = req.params.id
    validateBookingFields(req.body);

    const room = await RoomModel.findById(roomId);
    if (!room) {
        throw new AppError('Room not found', 404);
    }
    if (!room.availability) {
        throw new AppError('Room is not available', 400);
    }
    if (room.seats < seats) {
        throw new AppError('Not enough seats available', 400);
    }

    const baseCharge = calculateBaseCharge(selectedPlan, room, timeFrom, timeTo, seats);
    const { finalCharge, promo } = await applyPromoCode(promoCode, baseCharge);

    // const session = await Mongoose.startSession(); // Call startSession on mongoose
    // session.startTransaction();

    const booking = await BookingModel.create(
        [{
            userId,
            roomId,
            date,
            timeFrom,
            timeTo,
            seats,
            selectedPlan,
            promoCode: promo ? promo._id : null,
            finalCharge,
        }],
        // { session }
    );

    const updatedRoom = await RoomModel.findOneAndUpdate(
        { _id: roomId, seats: { $gte: seats } },
        { $inc: { seats: -seats }, $set: { availability: (room.seats - seats === 0) ? false : room.availability } },
        { new: true }
    );

    if (!updatedRoom) {
        // await session.abortTransaction();
        // session.endSession();
        throw new AppError('Room update failed', 500);
    }

    // await session.commitTransaction();
    // session.endSession();

    res.status(201).json({ message: 'Booking created successfully', booking });
});




const getUserBookings = catchAsyncError(async (req, res) => {
    const userId = req.user.id;
    const { type } = req.query; // Get the query parameter 'type'
    const currentDate = new Date(); // Get the current date

    let filter;

    if (type === 'past') {
        filter = { userId, date: { $lt: currentDate } };
    } else if (type === 'upcoming') {
        filter = { userId, date: { $gte: currentDate } };
    } else {
        throw new AppError('Invalid type parameter. Use "past" or "upcoming".', 400);
    }

    // Retrieve bookings and sort by date in descending order
    const bookings = await BookingModel.find(filter).sort({ date: -1 }); // -1 for descending order

    res.status(200).json({
        status: 'success',
        message: `User ${type} bookings retrieved successfully`,
        data: {
            bookings
        }
    });
});

export {
    createBooking,
    getUserBookings
};



