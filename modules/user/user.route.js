const router = require("express").Router();
const controller = require("./user.controller");
router.post("/", controller.createUser);
router.get("/", controller.getUsers);
router.patch("/make-admin/:id", controller.makeAdmin);
module.exports = router;
