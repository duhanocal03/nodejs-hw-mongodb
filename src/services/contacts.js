const Contact = require('../db/Contact');

const getAllContactsService = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
}) => {
  const skip = (page - 1) * perPage;

  const filter = { userId };

  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter)
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }),
    Contact.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage: Number(page) > 1,
    hasNextPage: Number(page) < totalPages,
  };
};

const getContactByIdService = async (userId, contactId) => {
  return Contact.findOne({ _id: contactId, userId });
};

const createContactService = async (payload) => {
  return Contact.create(payload);
};

const updateContactService = async (userId, contactId, payload) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true }
  );
};

const deleteContactService = async (userId, contactId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};

module.exports = {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService
};
