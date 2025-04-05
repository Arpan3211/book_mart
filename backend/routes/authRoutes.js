import express from "express";
import {
  registerUser,
  loginUser,
  getUserDetails,
} from "../controllers/authController.js";
import { validateRegistration, validateLogin } from "../middleware/validation.js";

const router = express.Router();

router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/user/:userId", getUserDetails);

export default router;
