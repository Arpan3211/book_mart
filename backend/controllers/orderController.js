import Cart from "../models/Cart.js";
import Order from "../models/orderModel.js";
import Book from "../models/Book.js";

export const placeOrder = async (req, res) => {
  const { userId, paymentMethod, address, totalAmount } = req.body;

  try {
    if (!userId || !paymentMethod || !address || !totalAmount) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty!" });
    }

    const bookData = await Promise.all(
      cart.items.map(async (item) => {
        const book = await Book.findOne({ bookId: item.bookId });
        if (!book) throw new Error(`Book with ID ${item.bookId} not found`);
        return {
          bookId: book.bookId,
          quantity: item.quantity,
          price: book.price,
        };
      })
    );

    const calculatedTotalAmount = bookData.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (Math.abs(calculatedTotalAmount - totalAmount) > 1) {
      return res.status(400).json({ message: "Invalid total amount!" });
    }

    const order = new Order({
      userId,
      items: bookData.map(({ bookId, quantity }) => ({ bookId, quantity })),
      totalAmount: calculatedTotalAmount,
      address,
      paymentMethod,
      status: "Pending",
    });

    await order.save();

    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId });
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const itemsWithBookDetails = await Promise.all(
          order.items.map(async (item) => {
            const book = await Book.findOne({ bookId: item.bookId });
            return {
              ...item.toObject(),
              book,
            };
          })
        );

        return {
          ...order.toObject(),
          items: itemsWithBookDetails,
        };
      })
    );

    res.status(200).json(enrichedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  const validStatuses = [
    "Pending",
    "Processing",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Returned",
    "Cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res
      .status(200)
      .json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
