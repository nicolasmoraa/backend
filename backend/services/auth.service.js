import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const SECRET_KEY = "claveSuperSecreta123";

// Servicio de autenticación
export const authService = {
  /**
   * Genera un token JWT con la información básica del usuario
   * @param {Object} user
   * @returns {string}
   */
  generateToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  },

  /**
   * Verifica un token JWT
   * @param {string} token - Token JWT recibido del cliente
   * @returns {Object} payload decodificado si es válido
   * @throws error si es inválido o expirado
   */
  verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
  },

  /**
   * Hashea una contraseña antes de guardarla en la base de datos
   * @param {string} password
   * @returns {string} contraseña encriptada
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },

  /**
   * Compara una contraseña ingresada con el hash almacenado
   * @param {string} password - Contraseña en texto plano
   * @param {string} hash - Contraseña encriptada guardada en DB
   * @returns {boolean} true si coinciden, false si no
   */
  comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
};
