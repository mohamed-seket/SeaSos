const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const { io } = require("./utils/socketjs");

const usersRouter = require('./routes/Users/userRoutes');
const urgenceRouter = require('./routes/urgence/urgence');
const authRouter = require('./routes/authentificationRoutes');
const resetPassword = require('./routes/resetPasswordRoute');
const patrolRouter = require('./routes/patrolRoutes');  // Add this line
const boatRouter = require('./routes/boatRoutes'); 

var app = express();
const allowedOrigins = ['http://localhost:3000', 'http://localhost:54287',"http://localhost:55218","http://10.0.2.2"];

app.use(cors({
  origin: true, // This allows all origins
  credentials: true // Allow credentials if needed
}));
app.enable('trust proxy');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/urgences', urgenceRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/resetpwd', resetPassword);
app.use('/api/patrols', patrolRouter);  // Add this line
app.use('/api/boats', boatRouter);  // Add this line
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database! ');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ error: err });
});

app.set('port', 3030);
var server = http.createServer(app);
server.listen(3030);
io.attach(server);
module.exports = app;
