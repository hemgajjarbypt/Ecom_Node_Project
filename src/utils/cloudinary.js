import { v2 as cloudinary } from 'cloudinary';
import fs from "node:fs";

cloudinary.config({
    cloud_name: 'ecom-node-project',
    api_key: '268781127288825',
    api_secret: '6y1m9YPMNwAKlSsL0V1k3xt6awo'
});

// cloudinary.config({
//     cloud_name: 'dkebsxjmk',    
//     api_key: '591575686818777',
//     api_secret: '46gtxfQ3Kl0NupB59wxa8XDi9jg'
// });

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export { uploadOnCloudinary }