const Contact = require('../db/Contact');

const getAllContactsService = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
}) => {
  const skip = (page - 1) * perPage;

  const filter = {};

  // contactType filtre
  if (type) {
    filter.contactType = type;
  }

  // isFavourite filtre (string -> boolean)
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  const totalItems = await Contact.countDocuments(filter);

  const contacts = await Contact.find(filter)
    .skip(skip)
    .limit(perPage)
    .sort({
      [sortBy]: sortOrder === 'desc' ? -1 : 1,
    });

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
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
