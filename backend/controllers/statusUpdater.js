import Order from "../models/orderModel.js";
import schedule from "node-schedule";

const STATUS_FLOW = [
  "Pending",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export const updateOrderStatus = async () => {
  try {
    const orders = await Order.find({ status: { $ne: "Delivered" } });

    for (const order of orders) {
      const currentIndex = STATUS_FLOW.indexOf(order.status);
      if (currentIndex !== -1 && currentIndex < STATUS_FLOW.length - 1) {
        order.status = STATUS_FLOW[currentIndex + 1];
        await order.save();
        console.log(`Order ${order._id} updated to ${order.status}`);
      }
    }
  } catch (error) {
    console.error("Error updating order status:", error.message);
  }
};

// Schedule status update every 6 hours
schedule.scheduleJob("*/1 * * * *", updateOrderStatus);

console.log("Status updater scheduled every 6 hours.");
