import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponses.js";


const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, brand, isAvailable } = req.body;

    const validateUserField = [name, description, category, brand].some((field) => {
        return field === undefined || field.trim() === "";
    })

    if (validateUserField) {
        return apiError(res, 400, "All fields are required");
    }


    const imagePath = req.file.path;

    if (!imagePath) {
        return apiError(res, 400, "image file are required");
    }

    const image = await uploadOnCloudinary(imagePath);
    if (!image) {
        return apiError(res, 400, "image file not uploaded");
    }

    const product = await Product.create({
        name,
        description,
        brand,
        price,
        stock,
        category,
        isAvailable,
        image: image.url
    })

    const createdProduct = await Product.findById(product._id).select("-__v -createdAt -updatedAt");

    if (!createdProduct) {
        return apiError(res, 500, "Something Went while creating a product!");
    }

    return res.status(200).json({ product: createdProduct, message: "Product is Created Successfully" });
});

export { createProduct };

