const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5001;

async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.warn(`⚠️  Starting without a database: ${err.message}`);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start();

// Surface unexpected failures instead of dying silently.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
