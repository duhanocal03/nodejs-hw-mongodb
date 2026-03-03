const express = require('express');
const router = express.Router();

const ctrlWrapper = require('../utils/ctrlWrapper');
const validateBody = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

const {
  contactSchema,
  updateContactSchema,
} = require('../validation/contacts');

const {
  getAllContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact,
} = require('../controllers/contacts');

router.use(authenticate);

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
  ctrlWrapper(patchContact)
);

router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContact)
);

router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(contactSchema),
  ctrlWrapper(createContact)
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContact)
);

module.exports = router;