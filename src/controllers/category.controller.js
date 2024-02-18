import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponses.js";
import mongoose from "mongoose";

const createCategory = asyncHandler(async (req, res) => {
    const { name, description, isAvailable, products } = req.body;


    const newCategory = await Category.create({
        name,
        description,
        isAvailable,
        products
    });

    const product = await Product.findOne({ name: products });
    const category = await Category.aggregate([
        {
            $match: {
                _id: newCategory._id
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "products",
                foreignField: "_id",
                as: "products"
            }
        },
        {
            $addFields: {
                "products": {
                    $map: {
                        input: "$products",
                        as: "product",
                        in: {
                            name: "$$product.name",
                            description: "$$product.description"
                        }
                    }
                }
            }
        }
    ])
    return res.status(200).send(category);
});


export { createCategory };
