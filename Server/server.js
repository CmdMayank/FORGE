require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
require('colors');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FORGE server running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.bold);
});
