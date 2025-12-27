import authService from './auth.service.js';


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reponse = await authService.login(email, password);
    res.status(200).json(reponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await authService.register(email, password);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default {
  login,
  register
};