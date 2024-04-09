const joi = require('joi');

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(6).max(32).required().label('Password'),
      confirm_password: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('Confirm Password'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  changePassword: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      old_password: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('Old Password'),
      new_password: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('New Password'),
      confirm_password: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('Confirm Password'),
    },
  },
};
