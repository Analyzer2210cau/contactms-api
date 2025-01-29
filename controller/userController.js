import UserModel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config();

console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);



export const registerUser = async (req, res) => {

  const errs = validationResult(req)
  if (!errs.isEmpty()) {
    return res.status(400).json({ errs: errs.array() })
  }
  const { name, email, password } = req.body;

  console.log(name, email, password)

  try {
    const userExist = await UserModel.findOne({ email: email })
    if (userExist) {
      return res.status(400).json({
        errs: [{ msg: "user already existed" }]
      })
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({ name, email, password: hashPassword })
    const creatduser = await newUser.save()
    creatduser._doc.password = undefined;

    return res.status(201).json({ success: true, ...creatduser._doc })


  } catch (err) {
    return res.status(500).json({ err: err.message })
  }

  return res.status(200).json("ok")


}

export const loginUser = async (req, res) => {
  console.log("LoginUser function invoked");
  console.log("Request body:", req.body);

  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    console.log("Validation errors:", errs.array());
    return res.status(400).json({ errs: errs.array() });
  }

  const { email, password } = req.body;
  console.log("Email:", email);
  console.log("Password:", password);

  try {
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      console.log("User not found");
      return res.status(400).json({ errs: [{ msg: "User not Registered" }] });
    }

    const isPasswordOk = await bcrypt.compare(password, userExist.password);
    if (!isPasswordOk) {
      console.log("Incorrect password");
      return res.status(400).json({ errs: [{ msg: "Incorrect password" }] });
    }

    const token = jwt.sign({ email: userExist.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    console.log("Login successful. Token:", token);
    userExist.password = undefined

    return res.status(201).json({ success: true, user: userExist, token });
  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({ err: err.message });
  }
};

export const Auth = (req, res) => {
  console.log("verify route hit");
  if (req.user) {
    return res.status(200).json({ success: true, user: req.user });
  }
  return res.status(401).json({ success: false, error: "User not found" });
};

