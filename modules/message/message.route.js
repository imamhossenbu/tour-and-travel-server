const router = require("express").Router();
const controller = require("./message.controller");
router.post("/", controller.createMessage);
router.get("/", controller.getMessages);
module.exports = router;
