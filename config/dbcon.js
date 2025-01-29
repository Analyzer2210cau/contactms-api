import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: './config/.env' })


const dbConnection = async () => {
  try {

    await mongoose.connect(process.env.MONGOURI)
    console.log("Database is connected")

  }
  catch (err) {
    console.log("Connectivity Error", err.message)
  }
}

dbConnection(); 