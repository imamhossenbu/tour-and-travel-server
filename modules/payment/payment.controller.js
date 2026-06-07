const sslcz = require("../../utils/sslcommerz");
const Payment = require("./payment.model");
const User = require("../user/user.model");
const initiatePayment = async (req, res) => {
  try {
    const { booking_id, amount, cus_name, cus_email, cus_phone } = req.body;
    const tran_id = `tran_${Date.now()}`;
    const data = {
      total_amount: amount,
      currency: "BDT",
      tran_id,
      success_url: "http://localhost:5000/api/payments/success",
      fail_url: "http://localhost:5173/fail",
      cancel_url: "http://localhost:5173/cancel",
      ipn_url: "http://localhost:5000/ipn",
      shipping_method: "Courier",
      product_name: "Tour Package",
      product_category: "Travel",
      product_profile: "general",
      cus_name,
      cus_email,
      cus_phone,
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
    };
    const apiResponse = await sslcz.init(data);
    const user = await User.findOne({ email: cus_email });
    await Payment.create({
      booking_id,
      user_id: user._id,
      amount,
      currency: "BDT",
      cus_name,
      cus_email,
      cus_phone,
      transaction_id: tran_id,
    });
    res.json({ success: true, url: apiResponse.GatewayPageURL });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { initiatePayment };
