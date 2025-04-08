const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  date: { type: Date, default: Date.now },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      quantity: { type: Number, default: 1 }
    }
  ],
  paymentType: String,
  address: {
    address1: { type: String },
    city: { type: String },
    pincode: { type: String }
  },
  status: { type: String },
  cancelReason: { type: String }
});

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
