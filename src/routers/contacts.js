const express = require('express');
const router = express.Router();

const ctrlWrapper = require('../utils/ctrlWrapper');
const validateBody = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');

const {
  contactSchema,
  updateContactSchema,
} = require('../validation/contacts');

const {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contacts');

router.get('/',ctrlWrapper(getAllContacts));

router.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactById)
);

router.post(
  '/',
  validateBody(contactSchema),
  ctrlWrapper(createContact)
);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact)
);

router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContact)
);

module.exports = router;