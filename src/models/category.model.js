import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["Furniture", "Electronics", "Fashion", "Toys", "Beauty", "Sports", "Books", "Travel", "Appliances", "Stationery"],
        required: [true, "Category Name is required"]
    },
    description: {
        type: String,
        required: [true, "Category Description is Required"],
        max: 100
    },
    products: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }   
    }],
    numberOfProducts: {
        type: Number,
        min: 0,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);

export { Category };