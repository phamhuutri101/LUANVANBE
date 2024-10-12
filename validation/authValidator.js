const Joi = require("joi");
const registerUserSchema = Joi.object({
  user_name: Joi.string().required(),
  password: Joi.string().required(),
  full_name: Joi.string().required(),
  email_user: Joi.string().email().required(),
  phone_number: Joi.number().required(),
  gender: Joi.string().valid("Nam", "Nữ", "Khác"),
});

const loginUserSchema = Joi.object({
  user_name: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
};
