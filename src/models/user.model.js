import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    }
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = bcrypt.hash(this.password, 10);
    next();
})

const hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const User = mongoose.model("User", userSchema);

export { User, hashPassword };