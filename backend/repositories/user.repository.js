// repositories/user.repository.js
import UserDAO from "../daos/user.dao.js";
import bcrypt from "bcrypt";

export default class UserRepository {
  constructor() {
    this.dao = new UserDAO();
  }

  async register({ first_name, last_name, email, age, password }) {
    const existing = await this.dao.findByEmail(email);
    if (existing) throw new Error("USER_EXISTS");
    const hashed = bcrypt.hashSync(password, 10);
    const user = await this.dao.create({ first_name, last_name, email, age, password: hashed });
    return user;
  }

  async validatePassword(email, password) {
    const user = await this.dao.findByEmail(email);
    if (!user) return null;
    const ok = bcrypt.compareSync(password, user.password);
    return ok ? user : null;
  }

  async setReset(id, token, expiresAt) {
    return this.dao.setResetToken(id, token, expiresAt);
  }

  async findByEmail(email) { return this.dao.findByEmail(email); }
  async findById(id) { return this.dao.findById(id); }
  async updatePassword(id, newPassword) {
    const hashed = bcrypt.hashSync(newPassword, 10);
    return this.dao.updateById(id, { password: hashed });
  }

  async clearReset(id) {
    return this.dao.clearResetToken(id);
  }
}
