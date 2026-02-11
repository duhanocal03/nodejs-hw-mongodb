const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');

const {
  getAllContacts,
  getContactById,
} = require('./controllers/contacts');

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp());

  app.get('/contacts', getAllContacts);
  app.get('/contacts/:contactId', getContactById);

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  return app;
}

module.exports = setupServer;