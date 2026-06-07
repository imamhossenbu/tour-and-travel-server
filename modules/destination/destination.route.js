const router = require("express").Router();
const controller = require("./destination.controller");
router.post("/", controller.createDestination);
router.get("/", controller.getDestinations);
router.get("/:id", controller.getSingleDestination);
module.exports = router;
