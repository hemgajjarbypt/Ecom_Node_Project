import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const router = Router();

router.route('/register').post(upload.single('photo'), async (req, res) => {
    const { email, phone, name } = req.body;


    console.log(req.file);
    const imagePath = req.file.path;

    if (!imagePath) {
        return apiError(res, 400, "image file are required");
    }

    const image = await uploadOnCloudinary(imagePath);
    if (!image) {
        return apiError(res, 400, "image file not uploaded");
    }

    return res.status(200).json({
        name: name.toUpperCase(),
        phone: phone,
        image: image.url
    });
})

export default router;