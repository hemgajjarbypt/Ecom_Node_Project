import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { ACCESS_TOKEN_PRIVATE_KEY } from "../constants.js";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("x-auth-token")?.replace("Bearer ", "");

        if (!token) {
            return apiError(res, 401, "AccessToken Not Provided!");
        }

        const decodedToken = jwt.verify(token, ACCESS_TOKEN_PRIVATE_KEY);

        if (!decodedToken) {
            return apiError(res, 401, "Invalid Access Token");
        }

        const user = await User.findById(decodedToken.id).select("-password -__v -refreshToken -createdAt -updatedAt -isLoggedIn");

        if (!user) {
            return apiError(res, 401, "User not exits with given accessToken")
        }

        req.user = user
        next();
    } catch (error) {
        return apiError(res, 401, error?.message || "Invalid Access Token!");
    }
})

export { verifyJWT };