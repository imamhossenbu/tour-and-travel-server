const service = require("./package.service");
const createPackage = async (req, res) => {
  try {
    const result = await service.createPackage(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getPackages = async (req, res) => {
  try {
    const result = await service.getPackages();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getSinglePackage = async (req, res) => {
  try {
    const result = await service.getSinglePackage(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { createPackage, getPackages, getSinglePackage };
