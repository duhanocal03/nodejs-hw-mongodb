const dotenv = require('dotenv');
const setupServer = require('./server');
const initMongoConnection = require('./db/initMongoConnection');

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  await initMongoConnection();

  const app = setupServer();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();