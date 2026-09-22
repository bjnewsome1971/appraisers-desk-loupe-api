const User = require('../models/User');

const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return res.json(users);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json(user);
};

module.exports = {
  getUsers,
  getUserById
};
