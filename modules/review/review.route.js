const router = require("express").Router();
const controller = require("./review.controller");
router.post("/", controller.createReview);
router.get("/", controller.getReviews);
router.get("/:id", controller.getSinglePackageReviews);
router.patch("/:id", controller.updateReview);
router.delete("/:id", controller.deleteReview);
module.exports = router;
