import jwt from 'jsonwebtoken'
import envConfig from '../config/envConfig.js';

function authMiddleware() {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, envConfig.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token.' });
      }

      req.user = user;
      next();
    })
  }
}

export default authMiddleware