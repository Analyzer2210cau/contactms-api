import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import './config/dbcon.js'
import router from "./Routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());



app.use("/contactms", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
