const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    currency: String,
    cus_name: String,
    cus_email: String,
    cus_phone: String,
    payment_status: { type: String, default: "Pending" },
    payment_method: { type: String, default: "SSLCommerz" },
    transaction_id: String,
  },
  { timestamps: true },
);
module.exports = mongoose.model("Payment", paymentSchema);
