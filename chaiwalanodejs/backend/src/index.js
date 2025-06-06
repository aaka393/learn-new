// require("dotenv").config({path: "./env"});
// import dotenv from "dotenv";
// import connectDB from "./db/index.js";

// dotenv.config({ path: "./env" });

// connectDB();



// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
// import express from "express";
// const app = express();
// (async () => {
//     try {
//    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//    app.on('error', (err) => {
//         console.log("Error", err);
//         throw err;
//     });
//         app.listen(process.env.PORT, () => {
//             console.log(`Server listening at http://localhost:${process.env.PORT}`);
//         });
//     } catch (error){
//         console.log("Error", error);
//     }
// })()  


//connet

import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/index.js"
import { DB_NAME } from "./constants.js";
import express from "express";
import { app } from './app.js'
dotenv.config({
    path: "./.env"
});

connectDB();
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on('error', (err) => {
            console.log("Error", err);
            throw err;
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server listening at http://localhost:${process.env.PORT}`);
        });
    } catch (error) {
        console.log("Error", error);
    }
})();