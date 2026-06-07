const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    rating: { type: Number, required: true },
    message: { type: String, required: true },
    user_name: String,
    user_uid: String,
    user_photo_url: String,
  },
  { timestamps: true },
);
module.exports = mongoose.model("Review", reviewSchema);
