const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  travelDate: Date,
  numTravelers: Number,
  status: { type: String, default: 'Pending' },
  totalPrice: Number
});

module.exports = mongoose.model('Booking', bookingSchema);