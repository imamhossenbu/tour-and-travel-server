const router = require("express").Router();
const controller = require("./payment.controller");
router.post("/initiate", controller.initiatePayment);
module.exports = router;
