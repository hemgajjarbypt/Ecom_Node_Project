import { User, hashPassword } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponses.js";

const registerUser = asyncHandler( async (req, res) => {
    const {userName, firstName, lastName, email, phone, password, address } = req.body;

    const validateUserField = [userName, firstName, lastName, email, password, phone].some( (field) => {
        return field === undefined || field.trim() === "";
    })

    if(validateUserField){
        // return res.status(400).send("All fields are required");
        // throw new ApiError(400, "All fields are required");
        return apiError(res, 400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{userName}, {email}]
    })

    if(existedUser){
        // throw new ApiError(409, "User with email or username already exists!");
        return apiError(res, 409, "User with email or username already exists!");
    }

    const newPassword = await hashPassword(password);

    const user = await User.create({
        userName: userName.toLowerCase(),
        firstName,
        lastName,
        email,
        phone,
        password: newPassword,
        address
    });

    const createdUser = await User.findById(user._id)
        .select("-password -__v -createdAt -updatedAt -lastLogin -isLoggedIn");

    if(!createdUser){
        // throw new ApiError(500, "Something Went while registering a user!");
        return apiError(res, 500, "Something Went while registering a user!");
    }


    // return res.status(200).json(new ApiResponse(200, "User Registered Successfully"));
    return apiResponse(res, 200, createdUser, "User Registered Successfully");

})


export { registerUser }