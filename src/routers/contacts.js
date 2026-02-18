const express = require('express');

const {
  getAllContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact
} = require('../controllers/contacts');

const { ctrlWrapper } = require('../utils/ctrlWrapper');

const router = express.Router();

router.get('/contacts', ctrlWrapper(getAllContacts));
router.get('/contacts/:contactId', ctrlWrapper(getContactById));
router.post('/contacts', ctrlWrapper(createContact));
router.patch('/contacts/:contactId', ctrlWrapper(patchContact));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContact));


module.exports = router;
