const express= require('express')
const cors = require("cors")

const globalErrorHandler = require('./controllers/errorController');
const studentRouter = require('./routes/studentRoutes')


const AppError = require('./utils/appError');

const port = 4000
const cookieParser = require('cookie-parser');
const app = express()

app.use(cors());
app.options('*', cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello from server');
  });

  app.use('/api/v1/students', studentRouter);

  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  app.use(globalErrorHandler);

module.exports = app;