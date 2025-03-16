import mongoose from "mongoose";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Book from "../models/Book.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, bookId, quantity = 1 } = req.body;

    console.log("Received request:", req.body);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.bookId === bookId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ bookId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Book added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const book = await Book.findOne({ bookId: item.bookId });
        return { ...item.toObject(), book };
      })
    );

    res.json({ ...cart.toObject(), items: populatedItems });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.bookId.toString() !== bookId);
    await cart.save();

    res.json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    await Cart.deleteOne({ userId });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, bookId, change } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.bookId.toString() === bookId);
    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    item.quantity += change;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.bookId.toString() !== bookId
      );
    }

    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { userId, bookId, change } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    let item = cart.items.find((item) => item.bookId.toString() === bookId);

    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    item.quantity += change;

    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.bookId.toString() !== bookId
      );
    }

    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
};
