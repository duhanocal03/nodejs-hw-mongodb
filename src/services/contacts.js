const Contact = require('../db/Contact');

const getAllContactsService = async () => {
  return Contact.find();
};

const getContactByIdService = async (contactId) => {
  return Contact.findById(contactId);
};

const createContactService = async (payload) => {
  return Contact.create(payload);
};

const updateContactService = async (contactId, payload) => {
  return Contact.findByIdAndUpdate(
    contactId,
    payload,
    { new: true }
  );
};

const deleteContactService = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};


module.exports = {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService
};
