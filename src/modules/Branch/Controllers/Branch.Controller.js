
import { AppError, catchAsyncError } from "../../../utils/error.handler.js";
import BranchModel from "../Models/Branch.Model.js";

const AddBranch = catchAsyncError(async (req, res) => {
    const { name, address } = req.body;
    const ownerId = req.user.id;

    if (!name || !address) {
        throw new AppError('All fields are required', 400);
    }

    const branch = await BranchModel.create({ name, address, ownerId });

    res.status(201).json({ message: 'Branch added successfully', branch });
});


const getBranch = catchAsyncError(async (req, res) => {
    const branchId = req.params.id;
    const branch = await BranchModel.findById(branchId);

    if (!branch) {
        throw new AppError('Branch not found', 404);
    }

    res.status(200).json({ message: 'Branch retrieved successfully', branch });
});

const getAllBranches = catchAsyncError(async (req, res) => {
    const { page = 1, limit = 10, name } = req.query; // Default to page 1 and limit 10 if not provided

    // Build the filter
    const filter = {};
    if (name) {
        filter.name = { $regex: `^${name}`, $options: 'i' }; // Use regex to match names that start with 'name'
    }
    // Get the total count of documents that match the filter
    const totalCount = await BranchModel.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch the branches with pagination and filtering
    const branches = await BranchModel.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.status(200).json({
        status: 'success',
        message: 'Branches retrieved successfully',
        data: {
            branches,
            totalCount,
            totalPages,
            currentPage: Number(page)
        }
    });
});

const updateBranch = catchAsyncError(async (req, res) => {
    const branchId = req.params.id; // Assuming branch ID is passed as a URL parameter
    const { name, address } = req.body;
    const ownerId = req.user.id;

    // Validate that required fields are present
    if (!name || !address) {
        throw new AppError('All fields are required', 400);
    }

    // Verify the branch belongs to the authenticated owner
    const branch = await BranchModel.findOne({ _id: branchId, ownerId });
    if (!branch) {
        throw new AppError('Branch not found or not owned by user', 404);
    }

    // Update the branch
    branch.name = name;
    branch.address = address;
    await branch.save();

    res.status(200).json({ message: 'Branch updated successfully', branch });
});


const deleteBranch = catchAsyncError(async (req, res) => {
    const branchId = req.params.id; // Assuming branch ID is passed as a URL parameter
    const ownerId = req.user.id;

    // Verify the branch belongs to the authenticated owner
    const branch = await BranchModel.findOneAndDelete({ _id: branchId, ownerId });
    if (!branch) {
        throw new AppError('Branch not found or not owned by user', 404);
    }

    
    res.status(200).json({ message: 'Branch deleted successfully', branch });

});

export {
    AddBranch,
    getBranch,
    getAllBranches,
    updateBranch,
    deleteBranch
};
