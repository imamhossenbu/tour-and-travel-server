const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    package_id: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Wishlist", wishlistSchema);
