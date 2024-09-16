const Joi = require("joi");
const addressSchema = Joi.object({
  provide: Joi.string().required(),
  district: Joi.string().required(),
  commune: Joi.string().required(),
  desc: Joi.string().required(),
});
module.exports = addressSchema;
