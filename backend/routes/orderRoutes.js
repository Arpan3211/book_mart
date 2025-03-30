import express from "express";
import { placeOrder, getUserOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/place-order", placeOrder);
router.post("/update-status", updateOrderStatus);
router.get("/user/:userId", getUserOrders);

export default router;
