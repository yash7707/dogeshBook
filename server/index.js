import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import "./models/Dog.js";
import "./models/User.js";
import "./models/Post.js";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import dogRoutes from "./routes/dogRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000; // port
const app = express();

// connect DB
connectDB();

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://peaceful-bombolone-a823c5.netlify.app"
    ]
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/dogs", dogRoutes);

app.get("/", (req, res) => {
  res.send("Dog api working");
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

