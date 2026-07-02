const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const mongoose = require('mongoose');


const adsRoutes = require('./routes/ads.routes');
const usersRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes');

async function startServer() {
  try {
    //connect to db 
    const dbURI = 'mongodb://localhost:27017/searchWebsite';
    await mongoose.connect(dbURI);
    console.log('Successfully connected to the database');

    const app = express();

    // add middleware
    app.use(cors());
    app.use(express.json());

    //serve static files from react.app
    app.use(express.static(path.join(__dirname, '/client/build')));
    app.use(express.static(path.join(__dirname, '/public')));

    //add routes
    app.use(session({
      secret: 'xyz567',
      cookie: {
        secure: process.env.NODE_ENV == 'production',
      },
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ client: mongoose.connection.getClient() })
    })); 
    app.use('/api', adsRoutes);
    app.use('/api', usersRoutes);
    app.use('/auth', authRoutes);
    

    const server = app.listen(8000, () => {
      console.log('Server is running on port: 8000');
    });
  } 
  catch (err) {
    console.error('Failed to start server:', err.message);
  }
}

startServer();