import express from "express"
import "dotenv/config"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"

import  authRoutes from "./routes/auth.route.js"
import  userRoutes from "./routes/user.route.js"
import  chatRoutes from "./routes/chat.route.js"

const app = express()
const PORT = process.env.PORT

// app.use("/",authRoutes)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, ()=> {
    connectDB()
    console.log(`Server is running on port 5000: http://localhost:${PORT}/`);
})