import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { CORS_ORIGIN } from "./constants.js";


const app = express();

    
app.use(cors({
    origin: '*',
    credentials: true
}));


app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
// import formRouter from "./routes/form.routers.js";
import categoryRouter from "./routes/category.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
// app.use("/api/v1/form-data", formRouter);
app.use("/api/v1/category", categoryRouter);





export { app }