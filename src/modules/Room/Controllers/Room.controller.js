import { cloudinary } from "../../../utils/Cloudinary.config.js";
import { AppError, catchAsyncError } from "../../../utils/error.handler.js";
import BranchModel from "../../Branch/Models/Branch.Model.js";
import imageModel from "../../Image/Models/Image.Model.js";
import RoomModel from "../Models/Room.Model.js";




const AddRoom = catchAsyncError(async (req, res) => {
    const { name, seats, description, amenities, plans, availability } = req.body;

    const branchId = req.params.id;

    const userId = req.user.id;

    // Validate that required fields are present
    if (!name || !seats || !description || !amenities || !plans || typeof availability === 'undefined') {
        throw new AppError('All fields are required', 400)
    }

    // Verify the branch belongs to the authenticated owner
    const branch = await BranchModel.findOne({ _id: branchId});
    if (!branch) {
        throw new AppError('Branch not found or not owned by user', 404);
    }

    // Create the Room
    const Room = await RoomModel.create({ name, seats, description, amenities, plans, availability, branchId });



    // Handle image upload if a file is provided
    if (req.file) {
        const image = await imageModel.create({
            name: req.file.originalname,
            url: req.file.path,
        });

        // Update the Room with the new image ID    
        await RoomModel.findByIdAndUpdate(Room._id, { $push: { images: image._id } });
        cloudinary.uploader
            .upload(image.url, {
                use_filename: true
            }
            )
        await BranchModel.findByIdAndUpdate(branchId, { $push: { rooms: Room._id } });



    }


    res.status(201).json({ message: 'Room Added successfully ..', Room });
});

const GetRooms = catchAsyncError(async (req, res) => {
    const branchId = req.params.id; // Branch ID from the URL parameters
    const userId = req.user.id; // User ID from authentication
    const { name, page = 1, limit = 10 } = req.query; // Extract query parameters for filtering and pagination

    // Verify the branch belongs to the authenticated owner
    const branch = await BranchModel.findOne({ _id: branchId, ownerId: userId });
    if (!branch) {
        throw new AppError('Branch not found or not owned by user', 404);
    }

    // Build filter object
    const filter = { branchId };
    if (name) {
        filter.name = { $regex: `^${name}`, $options: 'i' }; // Filter for room names starting with the specified name (case insensitive)
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalRooms = await RoomModel.countDocuments(filter);
    const rooms = await RoomModel.find(filter).sort({ rating: -1 }).skip(skip).limit(Number(limit));

    if (rooms.length === 0) {
        throw new AppError('No rooms found', 404);
    }

    res.status(200).json({
        message: 'Rooms retrieved successfully',
        totalRooms,
        currentPage: Number(page),
        totalPages: Math.ceil(totalRooms / limit),
        rooms,
    });
});
const UpdateRoom = catchAsyncError(async (req, res) => {
    const { name, seats, description, amenities, plans, availability, branchId } = req.body;
    const roomId = req.params.id; // Assuming room ID is passed as a URL parameter

    // Validate that required fields are present
    if (!name || !seats || !description || !amenities || !plans || typeof availability === 'undefined') {
        throw new AppError('All fields are required', 400);
    }


    // Verify the room exists and belongs to the branch
    const room = await RoomModel.findOneAndUpdate(

        // Filter by Room ID
        { _id: roomId },
        {
            name,
            seats,
            description,
            amenities,
            plans,
            availability
        },

        { new: true } // Return the updated document)
    )
    if (!room) {
        throw new AppError('Room not found or does not belong to the specified branch', 404);
    }
    res.status(200).json({ message: 'Room updated successfully', room });
});
const DeleteRoom = catchAsyncError(async (req, res) => {
    const roomId = req.params.id; // Assuming room ID is passed as a URL parameter

    // Find the room 
    const room = await RoomModel.findById(roomId)
    if (!room) {
        throw new AppError('Room not found', 404);
    }



    // Delete associated images (if any)
    if (room.images && room.images.length > 0) {
        await imageModel.deleteMany({ _id: { $in: room.images } }); // Delete images using the room's image IDs
    }
    // Update the branch's rooms array
    await BranchModel.findByIdAndUpdate(
        room.branchId._id,
        { $pull: { rooms: roomId } }, // Remove the room ID from the branch's rooms array
        { new: true }
    );
    // Delete the room
    await RoomModel.findByIdAndDelete(roomId);

    res.status(200).json({ message: 'Room deleted successfully' });
});

export {
    AddRoom,
    GetRooms,
    UpdateRoom,
    DeleteRoom


}