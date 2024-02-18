import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category Name is required"]
    },
    description: {
        type: String,
        required: true,
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    isAvailable: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const Category = mongoose.model("Category", categorySchema);

export {Category};