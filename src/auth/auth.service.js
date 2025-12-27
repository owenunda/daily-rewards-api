import authRepository from './auth.repository.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';

const register = async (email, password) => {
  const existingUser = await authRepository.getUserByEmail(email);

  if (existingUser) {
    throw new Error('User already exists');
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = await authRepository.createUser(email, passwordHash);

  return {
    id: newUser.id,
    email: newUser.email
  };
}
const login = async (email, password) => {
  const user = await authRepository.getUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  if (!bcrypt.compareSync(password, user.password_hash)) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, envConfig.JWT_SECRET, { expiresIn: '1h' });

  const response = {
    user: {
      id: user.id,
      email: user.email
    },
    token
  };

  return response;

}

export default {
  login,
  register
};