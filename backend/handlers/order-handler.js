const Order = require("../db/order");

async function addOrder(userId, orderModel) {
  let order = new Order({
    ...orderModel,
    userId: userId,
    status: "inprogress"
  });
  await order.save();
}

async function getCustomerOrders(userId) {
  let orders = await Order.find({ userId: userId })
    .populate("items.product")
    .sort({ date: -1 });
  return orders.map((x) => x.toObject());
}

async function getOrders() {
  let orders = await Order.find()
    .populate("items.product")
    .populate("userId", "name email")
    .sort({ date: -1 });
  return orders.map((x) => x.toObject());
}

async function updateOrderStatus(id, status) {
  const order = await Order.findByIdAndUpdate(id, { status: status }, { new: true });
  return order;
}

async function cancelOrder(id, reason) {
  const order = await Order.findById(id);
  if (!order) return null;

  order.status = "Cancelled";
  order.cancelReason = reason;
  await order.save();

  return order;
}

async function deleteOrder(id) {
  const order = await Order.findByIdAndDelete(id);
  return order;
}

async function deleteOrderItem(orderId, itemId) {
  const order = await Order.findById(orderId);
  if (!order) return null;

  order.items = order.items.filter(item => item._id.toString() !== itemId);
  await order.save();

  return order;
}

async function updateOrderAddress(id, address) {
  const order = await Order.findById(id);
  if (!order) return null;

  order.address = {
    address1: address.address1,
    city: address.city,
    pincode: address.pincode
  };

  await order.save();
  return order;
}

module.exports = {
  addOrder,
  getCustomerOrders,
  getOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  deleteOrderItem,
  updateOrderAddress
};
