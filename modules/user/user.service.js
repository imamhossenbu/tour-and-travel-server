const User = require("./user.model");
const createUser = async (payload) => {
  const exist = await User.findOne({ email: payload.email });
  if (exist) {
    return exist;
  }
  return await User.create(payload);
};
const getUsers = async () => {
  return await User.find();
};
const makeAdmin = async (id) => {
  return await User.findByIdAndUpdate(id, { role: "admin" }, { new: true });
};
module.exports = { createUser, getUsers, makeAdmin };
