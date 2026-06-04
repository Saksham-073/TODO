const jwt = require('jsonwebtoken');

function signToken(user) {
  const id = user.id || user._id;
  return jwt.sign({ id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = { signToken };
