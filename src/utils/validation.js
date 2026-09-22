const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (value) => typeof value === 'string' && emailRegex.test(value.trim());

const isStrongPassword = (value) => {
  if (typeof value !== 'string') return false;

  return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
};

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

module.exports = {
  isValidEmail,
  isStrongPassword,
  normalizeEmail
};
