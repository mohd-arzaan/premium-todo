const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check karo ki header mein token hai ya nahi
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // "Bearer <token>" mein se sirf token nikaalo
      token = req.headers.authorization.split(' ')[1];

      // Token verify karo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User dhundo aur req.user mein daal do (password chhod ke)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Sab sahi hai, aage badho
    } catch (error) {
      return res.status(401).json({ message: 'Token invalid ya expire ho gaya' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Token nahi mila, access denied' });
  }
};

module.exports = { protect };