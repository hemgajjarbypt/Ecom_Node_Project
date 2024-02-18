import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponses.js";
import mongoose from "mongoose";

const createCategory = asyncHandler(async (req, res) => {

    const { name, description } = req.body;

    const newCategory = await Category.create({
        name,
        description
    });

    return res.status(200).send(newCategory);
});


export { createCategory };
