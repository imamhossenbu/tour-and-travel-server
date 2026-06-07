const express = require("express");
const cors = require("cors");


const userRoutes = require("./modules/user/user.route");
const destinationRoutes = require("./modules/destination/destination.route");
const packageRoutes = require("./modules/package/package.route");
const reviewRoutes = require("./modules/review/review.route");
const bookingRoutes = require("./modules/booking/booking.route");
const paymentRoutes = require("./modules/payment/payment.route");
const wishlistRoutes = require("./modules/wishlist/wishlist.route");
const messageRoutes = require("./modules/message/message.route");

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/users", userRoutes);

app.use("/api/destinations", destinationRoutes);

app.use("/api/packages", packageRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/messages", messageRoutes);

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Tour Travel API Running...");
});

module.exports = app;

