const Joi = require('joi');

const contactTypeEnum = ['work', 'home', 'personal'];

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean().truthy('true').falsy('false'),
  // enum kontrolü + zorunlu
  contactType: Joi.string().valid(...contactTypeEnum).required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean().truthy('true').falsy('false'),
  //enum kontrolü
  contactType: Joi.string().valid(...contactTypeEnum),
}).min(1);

module.exports = {
  contactSchema,
  updateContactSchema,
};