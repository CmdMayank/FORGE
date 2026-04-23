require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = require('./src/app');
const connectDB = require('./src/config/db');
require('colors');

// Start Server
const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`FORGE server running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.bold);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`.red);
    process.exit(1);
  }
};

startServer();
