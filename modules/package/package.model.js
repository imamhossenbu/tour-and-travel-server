const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    destination_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },

    title: String,
    description: String,
    price: Number,
    duration: String,
    image: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Package", packageSchema);
