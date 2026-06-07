const Destination = require("./destination.model");
const createDestination = async (payload) => {
  return await Destination.create(payload);
};
const getDestinations = async () => {
  return await Destination.find();
};
const getSingleDestination = async (id) => {
  return await Destination.findById(id);
};
module.exports = { createDestination, getDestinations, getSingleDestination };
