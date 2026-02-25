const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().min(3).max(20),
  contactType: Joi.string().min(3).max(20),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().min(3).max(20),
  contactType: Joi.string().min(3).max(20),
}).min(1); // en az 1 field zorunlu

module.exports = {
  contactSchema,
  updateContactSchema,
};