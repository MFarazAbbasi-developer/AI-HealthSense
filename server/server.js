import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";

import cookieParser from "cookie-parser";
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";
// Doctors
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoutes.js";



// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
// Doctors
connectCloudinary()

const allowedOrigins = ['https://ai-healthsense.vercel.app'];
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://ai-healthsense.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));


// API Endpoints
app.get("/", (req, res) => {
    res.send("Working...")
})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
// Admin
app.use('/api/admin', adminRouter)
// Doctors
app.use('/api/doctors', adminRouter)




app.listen(port, () => {
    console.log(`Server started on PORT:${port}`)
})