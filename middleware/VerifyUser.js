import jwt from "jsonwebtoken";
import UserModel from "../models/usermodel.js";
import dotenv from "dotenv";

dotenv.config();

export const VerifyUser = async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (authHeaders && authHeaders.startsWith("Bearer ")) {
    const token = authHeaders.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ error: "Token has expired. Please log in again." });
        }
        return res.status(401).json({ error: "Unauthorized Access" });
      }

      try {
        const user = await UserModel.findOne({ email: payload.email }).select("-password");
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        req.user = user; // Attach user to the request
        next();
      } catch (error) {
        console.error("Database Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    return res.status(403).json({ error: "Forbidden: No Authorization Header" });
  }
};
