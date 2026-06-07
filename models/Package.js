const mongoose = require("mongoose");
const packageSchema = new mongoose.Schema({
  title: String,
  destination_id: mongoose.Schema.Types.ObjectId,
  description: String,
  price: Number,
  duration: String,
  image: String,
  itinerary: [{ day_number: Number, activity: String, details: String }], 
});
module.exports = mongoose.model("Package", packageSchema);
