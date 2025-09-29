// daos/user.dao.js
import User from "../models/User.js";

export default class UserDAO {
  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findById(id) {
    return User.findById(id);
  }

  async updateById(id, update) {
    return User.findByIdAndUpdate(id, update, { new: true });
  }

  async setResetToken(id, token, expiresAt) {
    return User.findByIdAndUpdate(id, { resetToken: token, resetExpires: expiresAt }, { new: true });
  }

  async clearResetToken(id) {
    return User.findByIdAndUpdate(id, { resetToken: null, resetExpires: null }, { new: true });
  }
}
