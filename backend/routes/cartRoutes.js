import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
  updateCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.post("/remove", removeFromCart);
router.post("/clear", clearCart);
router.post("/update", updateCart);
router.post("/updateCartItemQuantity", updateCartItemQuantity);

export default router;
