import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_PRIVATE_KEY, ACCESS_TOKEN_PRIVATE_EXPIRY, REFRESH_TOKEN_PRIVATE_KEY, REFRESH_TOKEN_PRIVATE_EXPIRY } from "../constants.js"
import moment from "moment";

const userSchema = new mongoose.Schema({
    userName : {
        type: String,
        required: [true, "userName is required"],
        unique: true,
        lowercase: true,
        min: [5, "username must be 5 character long."],
        max: [30, "username must be less than 30 character"],
        index: true
    },
    firstName : {
        type: String,
        required: [true, "firstName is required"],
        min: [3, "firstName must be 3 character long."],
    },
    lastName : {
        type: String,
        required: [true, "lastName is required"],
        min: [3, "lastName must be 3 character long."],
    },
    email : {
        type : String,
        unique: true,
        lowercase: true,
        required: [true, "Email is Required"],  
        validate: {
            validator: function(email) {
                return /\S+@\S+\.\S+/.test(email);
            },
            message: "Please provide a valid email address."
        }
    },
    password : {
        type: String,
        required: [true, "Password is Required"]
    },
    phone: {
        type: Number,
        required: [true, "Phone Number is Required"],
        unique: true,
        validate: {
            validator: function(phone) {
                return /^[6-9]\d{9}$/.test(phone);
            },
            message: "Please provide a valid phone number."
        }
    },
    address: {
        type: String,

    },
    orderHistory: {
        type: String,

    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now()
    },
    refreshToken: {
        type: String
    }
}, {timestamps: {
        currentTime: () => moment().format('lll')
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        id: this._id,
        userName: this.userName,
        email: this.email
    }, ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: ACCESS_TOKEN_PRIVATE_EXPIRY });
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        id: this._id,
        userName: this.userName,
        email: this.email
    }, REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: REFRESH_TOKEN_PRIVATE_EXPIRY });
}

userSchema.methods.isPasswordValid = function (password) {
    return bcrypt.compare(password, this.password);
}

const isPasswordValid = function (user_password) {
    console.log(this.password);
    return bcrypt.compare(user_password, this.password);
}

const hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const User = mongoose.model("User", userSchema);

export { User, hashPassword, isPasswordValid };