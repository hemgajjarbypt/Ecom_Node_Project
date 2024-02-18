import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponses.js";
import mongoose from "mongoose";
import { Category } from "../models/category.model.js";


const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, brand, isAvailable } = req.body;

    const validateUserField = [name, description, category, brand].some((field) => {
        return field === undefined || field.trim() === "";
    })

    if (validateUserField) {
        return apiError(res, 400, "All fields are required");
    }

    const validateProduct = await Product.find({name, brand});

    if (validateProduct) {
        return apiError(res, 400, "Product With Same brand already exits in Database.");
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

    const createdProduct = await Product.findById(product._id).sort("name").select("-__v -createdAt -updatedAt");

    if (!createdProduct) {
        return apiError(res, 500, "Something Went while creating a product!");
    }

    const findCategory = await Category.find({name: category});
    

    findCategory[0].products.push({
        _id: createdProduct._id,
        name: createdProduct.name,
        price: createdProduct.price,
        stock: createdProduct.stock
    })

    findCategory[0].numberOfProducts += 1;
    await findCategory[0].save();

    return res.status(200).json({ product: createdProduct, message: "Product is Created Successfully" });
});

const getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.productId;

    if (!mongoose.isValidObjectId(productId)) {
        return apiError(res, 400, "Invalid productId");    
    }
    const product = await Product.findById(productId).select("-__v");

    if (!product) {
        return apiError(res, 400, "Product is not available in the Database.");
    }

    return apiResponse(res, 200, product);
});

const getProductByCategory = asyncHandler(async (req, res) => {
    const productCategory = req.params.productCategory;

    if (!productCategory) {
        return apiError(res, 400, "Invalid Category");
    }

    const products = await Product.find({category: productCategory}).sort("name").select("-__v");

    if (products.length === 0) {
        return apiError(res, 400, "No Products are available for this Category");
    }

    return apiResponse(res, 200, products, `Total Products : ${products.length}`);
});

const updateProductById = asyncHandler(async (req, res) => {
    const {price, isAvailable, stock, name, description} = req.body;

    const productId = req.params.productId;

    const filter = {_id: productId};
    const update = {price, isAvailable, stock, name, description};
    const options = {new: true};

    const newProduct = await Product.findByIdAndUpdate(filter, update, options);
    
    if (!newProduct) {
        return apiError(res, 400, "Can't Update the Product!!");
    }

    return apiResponse(res, 200, newProduct, "Product is Updated Successfully.");

});



export { 
    createProduct, 
    getProductById,
    getProductByCategory,
    updateProductById
};

