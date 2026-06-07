const Review = require("./review.model");
const createReview = async (payload) => {
  return await Review.create(payload);
};
const getReviews = async () => {
  return await Review.find().populate("package_id");
};
const getSinglePackageReviews = async (id) => {
  return await Review.find({ package_id: id });
};
const updateReview = async (id, payload) => {
  return await Review.findByIdAndUpdate(id, payload, { new: true });
};
const deleteReview = async (id) => {
  return await Review.findByIdAndDelete(id);
};
module.exports = {
  createReview,
  getReviews,
  getSinglePackageReviews,
  updateReview,
  deleteReview,
};
