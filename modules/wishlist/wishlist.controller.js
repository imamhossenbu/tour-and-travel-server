const service = require("./wishlist.service");
const addWishlist = async (req, res) => {
  try {
    const result = await service.addWishlist(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getWishlist = async (req, res) => {
  try {
    const result = await service.getWishlist(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const removeWishlist = async (req, res) => {
  try {
    await service.removeWishlist(req.params.id);
    res.json({ success: true, message: "Wishlist removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { addWishlist, getWishlist, removeWishlist };
