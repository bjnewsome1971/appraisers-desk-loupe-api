const { isValidEmail, isStrongPassword } = require('../utils/validation');

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'A valid email is required.' });
  }

  if (!password || !isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters and include a number and a symbol.'
    });
  }

  return next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'A valid email is required.' });
  }

  if (!password || !password.trim()) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  return next();
};

module.exports = {
  validateRegister,
  validateLogin
};
