const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    package_id: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    travel_date: String,
    num_travelers: Number,
    phone: String,
    email: String,
    total_price: Number,
    status: { type: String, default: "pending" },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Booking", bookingSchema);
