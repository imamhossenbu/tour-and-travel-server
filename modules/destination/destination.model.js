const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    description: String,
    image: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Destination", destinationSchema);
