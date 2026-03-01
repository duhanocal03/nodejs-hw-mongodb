const createHttpError = require('http-errors');

const {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService
} = require('../services/contacts');

const getAllContacts = async (req, res) => {
  const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;

  const result = await getAllContactsService({
    userId: req.user._id,
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactByIdService(req.user._id, contactId);

  if (!contact) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

const createContact = async (req, res) => {
  const userId = req.user._id;

  const newContact = await createContactService({
    ...req.body,
    userId,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created contact!',
    data: newContact,
  });
};

const patchContact = async (req, res) => {
  const { contactId } = req.params;

  const updated = await updateContactService(req.user._id, contactId, req.body);

  if (!updated) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const deleted = await deleteContactService(req.user._id, contactId);

  if (!deleted) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact
};
