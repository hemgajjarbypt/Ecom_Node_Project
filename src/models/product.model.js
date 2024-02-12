import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "product Name id required"]
    },
    description: {
        type: String,
        required: true,

    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [1, "price of product must be grater than 0 RS."],
        max: [1000, "price of product must be less than 1000 RS."]
    },
    category: {
        type: String,

    },
    brand: {
        type: String,

    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    isAvailable: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export { Product };

