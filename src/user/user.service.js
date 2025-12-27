import userRepository from "./user.repository.js";

const getUserById = async (userId) => {
  try {
    return await userRepository.getUserById(userId);
  } catch (error) {
    throw error;
  }
}

export default {
  getUserById
}