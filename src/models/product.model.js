import mongoose, { mongo } from "mongoose";
import moment from "moment";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "product Name is required"]
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: [true, "product image is required."]
    },
    price: {
        type: Number,
        required: true,
        min: [1, "price of product must be grater than 0 RS."],
        max: [10000, "price of product must be less than 10000 RS."]
    },
    category: {
        type: String,
        enum: ["Furniture", "Electronics", "Fashion", "Toys", "Beauty", "Sports", "Books", "Travel", "Appliances", "Stationery"],
        required: true
    },
    brand: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
        max: [100, "stocks of product must be less than 100"]
    },
    isAvailable: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);

export { Product };

