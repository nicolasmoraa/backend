// config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI no definido en .env");
    await mongoose.connect(uri);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error conectando a Mongo:", err.message);
    process.exit(1);
  }
}
