import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDb connected successfully");
    } catch (error) {
        console.log("❌ Error while connecting db",error);
        process.exit(1)
    }
}