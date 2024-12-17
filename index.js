process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! Shuting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
  
  const connectDB = require('./config/db');
  require('dotenv').config();
  
  const app = require('./app');
  
  
  connectDB();
  
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
  
  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTIONS! Shuting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
  
  process.on('SIGTERM', () => {
    console.log('SIGTERM! Shuting down...');
    server.close(() => {
      console.log('Process terminated');
    });
  });