import "dotenv/config"; // replaces require('dotenv').config()
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./middlewares/dbConnect.js";
import qrRouter from "./routes/apis/qr.js";

const PORT = process.env.PORT || 3500;
const app = express();

connectDB();
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5175",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5174",
    "http://localhost:1420",
    "https://tauri.localhost",
    "https://qredats.netlify.app",
  ],
  credentials: true,
};
app.use(cors(corsOptions));

//Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// Middleware for json
app.use(express.json());

app.use("/qr", qrRouter);

mongoose.connection.once("connected", () => {
  // Create text index
  //   Exercises.createIndexes()
  //     .then(() => console.log("Text indexes created for Exercises"))
  //     .catch((err) => console.error("Error creating text indexes", err));
  console.log("Mongoose connected");
  app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
});
