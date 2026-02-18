const createHttpError = require('http-errors');

const {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService
} = require('../services/contacts');

const getAllContacts = async (req, res) => {
  const contacts = await getAllContactsService();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactByIdService(contactId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res) => {
  const { name, phoneNumber, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    return res.status(400).json({
      message: 'Missing required fields',
    });
  }

  const newContact = await createContactService(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created contact!',
    data: newContact,
  });
};

const patchContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const payload = req.body;

    const updatedContact = await updateContactService(contactId, payload);

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const deletedContact = await deleteContactService(contactId);

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    // 204 → body OLMAZ
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact
};
