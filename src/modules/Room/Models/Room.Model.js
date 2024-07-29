import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,

    },
    seats: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    amenities: {
        type: [String],
        default: [],
    },
    plans:{
        hourly: {
            type: Number,
            required: true, // Ensure that this is required
        },
        daily: {
            type: Number,
            required: true, // Ensure that this is required
        },
        monthly: {
            type: Number,
            required: true, // Ensure that this is required
        },
    },
  
    availability: {
        type: Boolean,
        default: true,
    },
    isfavourite: {
        type: Boolean,
        default: false,
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true,
    },

});

const RoomModel = mongoose.model('Room', RoomSchema);

export default RoomModel;
