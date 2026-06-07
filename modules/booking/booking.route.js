const router = require("express").Router();
const controller = require("./booking.controller");
router.post("/", controller.createBooking);
router.get("/", controller.getBookings);
router.get("/user/:id", controller.getUserBookings);
router.patch("/:id", controller.updateBookingStatus);
router.delete("/:id", controller.deleteBooking);
module.exports = router;
