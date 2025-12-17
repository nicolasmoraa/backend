// repositories/user.repository.js
import User from "../models/User.js";

const UserRepository = {
  create: async (userData) => {
    const user = new User(userData);
    return await user.save();
  },
  findByEmail: async (email) => {
    return await User.findOne({ email });
  },
  findById: async (id) => {
    return await User.findById(id);
  },
  updateById: async (id, update) => {
    return await User.findByIdAndUpdate(id, update, { new: true });
  }
};

export default UserRepository;
