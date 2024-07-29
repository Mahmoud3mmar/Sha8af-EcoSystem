import mongoose from 'mongoose';

const BranchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        street: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        zipCode: {
            type: String
        },
        country: {
            type: String
        }
        ,locationURL:{
            type: String

        }
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }]
}, {
    timestamps: true // Automatically create `createdAt` and `updatedAt` fields
});

const BranchModel = mongoose.model('Branch', BranchSchema);

export default BranchModel;
