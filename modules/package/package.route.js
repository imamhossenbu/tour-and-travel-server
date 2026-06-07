const router = require("express").Router();
const controller = require("./package.controller");
router.post("/", controller.createPackage);
router.get("/", controller.getPackages);
router.get("/:id", controller.getSinglePackage);
module.exports = router;
