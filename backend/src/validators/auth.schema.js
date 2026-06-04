const { z } = require('zod');

// Username + password rules shared by register and login.
const credentials = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
});

module.exports = {
  registerSchema: credentials,
  loginSchema: credentials,
};
