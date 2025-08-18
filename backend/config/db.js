import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // carga las variables del .env

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("🔴 Error conectando a Mongo:", error);
    process.exit(1);
  }
};
