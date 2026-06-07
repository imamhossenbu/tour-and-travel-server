const Package = require("./package.model");
const createPackage = async (payload) => {
  return await Package.create(payload);
};
const getPackages = async () => {
  return await Package.find().populate("destination_id");
};
const getSinglePackage = async (id) => {
  return await Package.findById(id);
};
module.exports = { createPackage, getPackages, getSinglePackage };
