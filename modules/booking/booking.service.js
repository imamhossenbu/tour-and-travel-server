const Booking = require("./booking.model");
const createBooking = async (payload) => {
  return await Booking.create(payload);
};
const getBookings = async () => {
  return await Booking.find().populate("user_id").populate("package_id");
};
const getUserBookings = async (id) => {
  return await Booking.find({ user_id: id }).populate("package_id");
};
const updateBookingStatus = async (id, status) => {
  return await Booking.findByIdAndUpdate(id, { status }, { new: true });
};
const deleteBooking = async (id) => {
  return await Booking.findByIdAndDelete(id);
};
module.exports = {
  createBooking,
  getBookings,
  getUserBookings,
  updateBookingStatus,
  deleteBooking,
};
