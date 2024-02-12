import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { CORS_ORIGIN } from "./constants.js";


const app = express();


app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));


app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js"

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);





export { app }