import { User, hashPassword } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponses.js";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_PRIVATE_KEY } from "../constants.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        return console.error("Error while creating tokens", error.message);
    }
}

const registerUser = asyncHandler( async (req, res) => {
    const {userName, firstName, lastName, email, phone, password, address } = req.body;

    const validateUserField = [userName, firstName, lastName, email, password, phone].some( (field) => {
        return field === undefined || field.trim() === "";
    })

    if (validateUserField) {
        return apiError(res, 400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{userName}, {email}]
    })

    if (existedUser) {
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

    if (!createdUser) {
        return apiError(res, 500, "Something Went while registering a user!");
    }


    return apiResponse(res, 200, createdUser, "User Registered Successfully");

})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!(email && password)) {
        return apiError(res, 400, "Email and Password are Required!")
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        return apiError(res, 404, "User not exits!");
    }

    const isPasswordValid = user.isPasswordValid(password);

    if (!isPasswordValid) {
        return apiError(res, 401, "password is incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findByIdAndUpdate(user._id, { isLoggedIn: true }, { new: true }).select("-password -refreshToken -__v -createdAt -updatedAt -lastLogin");

    loggedInUser.lastLogin = Date.now();
    await loggedInUser.save();

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json({
            userName: loggedInUser.userName,
            isLoggedIn: loggedInUser.isLoggedIn,
            lastLogin: loggedInUser.lastLogin,
            message: `${loggedInUser.userName} is Logged in successfully`
        });
})

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            isLoggedIn: false,
            $unset: {
                refreshToken: 1
            }
        }, { new: true });

    const option = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .send(`${user.userName} is logged out successfully`);
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        return apiError(res, 401, "can't provide refreshToken");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_PRIVATE_KEY);

        if (!decodedToken) {
            return apiError(res, 401, "Invalid Refresh Token");
        }

        const user = await User.findById(decodedToken.id);

        if (!user) {
            return apiError(res, 401, "Invalid user with Refresh Token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return apiError(res, 401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        const option = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .send("Access Token Refreshed");


    } catch (error) {
        return apiError(res, 401, error?.message || "Something Went Wrong while refreshing token");
    }
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const isOldPasswordValid = await user.isPasswordValid(oldPassword);

    if (!isOldPasswordValid) {
        return apiError(res, 400, "invalid old password!");
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false });


    return res.status(200).json({ message: "Password Changed Successfully" });
})

const getUser = asyncHandler(async (req, res) => {
    const users = await User.find();
    if (users.length === 0) {
        return res.status(400).send('Users Not Exists!');
    }
    return res.status(200).send(users);
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, changePassword, getUser }