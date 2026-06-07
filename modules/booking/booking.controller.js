const service = require("./booking.service");
const createBooking = async (req, res) => {
  try {
    const result = await service.createBooking(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getBookings = async (req, res) => {
  try {
    const result = await service.getBookings();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getUserBookings = async (req, res) => {
  try {
    const result = await service.getUserBookings(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateBookingStatus = async (req, res) => {
  try {
    const result = await service.updateBookingStatus(
      req.params.id,
      req.body.status,
    );
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const deleteBooking = async (req, res) => {
  try {
    await service.deleteBooking(req.params.id);
    res.json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  createBooking,
  getBookings,
  getUserBookings,
  updateBookingStatus,
  deleteBooking,
};
