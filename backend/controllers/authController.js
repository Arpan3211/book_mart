import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateUserId = () => {
  return Math.random().toString(36).substring(2, 14).toUpperCase();
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        errors: [{ field: 'email', message: 'Email is already registered' }]
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique user ID
    const userId = generateUserId();

    // Create and save the new user
    user = new User({ userId, name, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return success response
    res.status(201).json({
      message: "Registration successful",
      token,
      userId: user.userId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: "Server error",
      errors: [{ field: 'server', message: 'An unexpected error occurred' }]
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        errors: [{ field: 'email', message: 'Email not found' }]
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        errors: [{ field: 'password', message: 'Incorrect password' }]
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return success response
    res.json({
      message: "Login successful",
      token,
      userId: user.userId
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: "Server error",
      errors: [{ field: 'server', message: 'An unexpected error occurred' }]
    });
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
