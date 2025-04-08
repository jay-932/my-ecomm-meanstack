const express = require("express");
const router = express.Router();

const {
  getOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  deleteOrderItem,
  updateOrderAddress
} = require("../handlers/order-handler");

// 🔁 GET all orders with user details
router.get("", async (req, res) => {
  try {
    const orders = await getOrders();
    res.send(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
});

// 🔁 Update order status
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  try {
    const order = await updateOrderStatus(id, status);
    if (!order) {
      return res.status(404).json({ message: "Order Not Found!" });
    }
    res.json({ message: "Order Status Updated Successfully!", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});

// 🔁 Cancel order with reason
router.patch("/:id/cancel", async (req, res) => {
  const { reason } = req.body;
  const id = req.params.id;

  if (!reason) return res.status(400).json({ message: "Cancel reason is required" });

  try {
    const order = await cancelOrder(id, reason);
    if (!order) {
      return res.status(404).json({ message: "Order Not Found!" });
    }

    res.json({ message: "Order Cancelled Successfully!", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel order", error: err.message });
  }
});

// 🔁 Delete order permanently
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const order = await deleteOrder(id);
    if (!order) {
      return res.status(404).json({ message: "Order Not Found!" });
    }

    res.json({ message: "Order Deleted Successfully!", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order", error: err.message });
  }
});

// ✅ Delete specific item from an order using handler
router.patch("/:orderId/items/:itemId/delete", async (req, res) => {
  const { orderId, itemId } = req.params;

  try {
    const order = await deleteOrderItem(orderId, itemId); // using handler now
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Item removed from order", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item", error: err.message });
  }
});

// 🆕 Update shipping address of an order
router.patch("/:id/update-address", async (req, res) => {
  const id = req.params.id;
  const { address1, city, pincode } = req.body;

  if (!address1 || !city || !pincode) {
    return res.status(400).json({ message: "All address fields are required" });
  }

  try {
    const order = await updateOrderAddress(id, { address1, city, pincode });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Address updated successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update address", error: err.message });
  }
});

module.exports = router;
