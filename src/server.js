const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/openapi.yaml');
const contactsRouter = require('./routers/contacts');
const { errorHandler } = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');
const authRouter = require('./routers/auth');
const cookieParser = require('cookie-parser');

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp());
  app.use(cookieParser());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = setupServer;