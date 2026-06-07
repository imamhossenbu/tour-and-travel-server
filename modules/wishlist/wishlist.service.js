const Wishlist = require("./wishlist.model");
const addWishlist = async (payload) => {
  return await Wishlist.create(payload);
};
const getWishlist = async (id) => {
  return await Wishlist.find({ user_id: id }).populate("package_id");
};
const removeWishlist = async (id) => {
  return await Wishlist.findByIdAndDelete(id);
};
module.exports = { addWishlist, getWishlist, removeWishlist };
