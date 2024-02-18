import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct, getProductById, getProductByCategory, updateProductById } from "../controllers/product.controller.js";


const router = Router();

router.route('/create').post(upload.single("image"), createProduct);
router.route('/getProductById/:productId').get(getProductById);
router.route('/getProductByCategory/:productCategory').get(getProductByCategory);
router.route('/updateProductById/:productId').post(updateProductById);

export default router;