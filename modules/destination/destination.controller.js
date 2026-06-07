const service = require("./destination.service");

const createDestination = async (req, res) => {
  try {
    const result = await service.createDestination(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDestinations = async (req, res) => {
  try {
    const result = await service.getDestinations();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleDestination = async (req, res) => {
  try {
    const result = await service.getSingleDestination(req.params.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDestination,
  getDestinations,
  getSingleDestination,
};
