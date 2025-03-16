import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateUserId = () => {
  return Math.random().toString(36).substring(2, 14).toUpperCase();
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = generateUserId();

    user = new User({ userId, name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, userId: user.userId });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, userId: user.userId });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
