const {
  getAllContactsService,
  getContactByIdService,
} = require('../services/contacts');

const getAllContacts = async (req, res) => {
  const contacts = await getAllContactsService();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactByIdService(contactId);

  if (!contact) {
    return res.status(404).json({
      message: 'Contact not found',
    });
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

module.exports = {
  getAllContacts,
  getContactById,
};
