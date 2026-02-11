const Contact = require('../db/Contact');

const getAllContactsService = async () => {
  return Contact.find();
};

const getContactByIdService = async (contactId) => {
  return Contact.findById(contactId);
};

module.exports = {
  getAllContactsService,
  getContactByIdService,
};