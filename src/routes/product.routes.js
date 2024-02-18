import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct } from "../controllers/product.controller.js";


const router = Router();

router.route('/create').post(upload.single("image"), createProduct);

export default router;