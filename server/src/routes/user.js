import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { UserModel } from "../models/users.js";
config();

const secret = process.env.JWT_SECRET;
const useHttps = process.env.USE_HTTPS === "true";
const recaptchaSecret = process.env.RECAPTCHA_SECRET;
const router = express.Router();

export const authenticate = (req, res, next) => {
  const token = req.cookies["access_token"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = decoded.id;
    next();
  });
};

router.post("/login", async (req, res) => {
  const { username, password, recaptcha: clientRecaptcha } = req.body;

  if (!username || !password || !clientRecaptcha) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: recaptchaSecret,
          response: clientRecaptcha,
        },
      }
    );

    if (response.data.success) {
      const user = await UserModel.findOne({ username });
      const errorMsg = "Username or password is incorrect";

      if (!user) {
        return res.status(400).json({ message: errorMsg });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: errorMsg });
      }

      const token = jwt.sign({ id: user._id }, secret);

      // Set httpOnly cookie
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: useHttps ? true : false,
      });

      res.json({ token, userID: user._id });
    } else {
      res.status(400).json({ message: "Invalid reCAPTCHA." });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
});

// router.post("/register", authenticate, async (req, res) => {
//   const { username, password } = req.body;
//   const user = await UserModel.findOne({ username });
//   if (user) {
//     return res.status(400).json({ message: "Username already exists" });
//   }
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser = new UserModel({ username, password: hashedPassword });
//   await newUser.save();
//   res.json({ message: "User registered successfully" });
// });

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, secret, (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
