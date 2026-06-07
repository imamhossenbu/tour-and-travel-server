const router = require("express").Router();
const controller = require("./wishlist.controller");
router.post("/", controller.addWishlist);
router.get("/:id", controller.getWishlist);
router.delete("/:id", controller.removeWishlist);
module.exports = router;
