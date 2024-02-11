import { app } from "./app.js";
import connectDB from "./db/index.js";
import { PORT } from "./constants.js";

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listing on port: ${PORT}`);
    })
}).catch((error) => {
    console.log("MongoDB connection failed!!", error.message);
})

