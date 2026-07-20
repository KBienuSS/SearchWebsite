require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const mongoose = require('mongoose');


const adsRoutes = require('./routes/ads.routes');
const authRoutes = require('./routes/auth.routes');

async function startServer() {
  try {
    //connect to db 
    const dbURI = process.env.NODE_ENV === 'production'
      ? `mongodb+srv://bienius234_db_user:${process.env.DB_PASS}@cluster0.h8jora6.mongodb.net/?appName=Cluster0`
      : 'mongodb://localhost:27017/searchWebsite';

    await mongoose.connect(dbURI);
    console.log('Successfully connected to the database');

    const app = express();

    // add middleware
    app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }));
    app.use(express.json());

    app.use(session({
      secret: process.env.SESSION_SECRET, 
      cookie: {
        secure: process.env.NODE_ENV == 'production',
      },
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ client: mongoose.connection.getClient() })
    })); 
    
    //serve static files from react.app
    app.use(express.static(path.join(__dirname, '/client/build')));
    app.use(express.static(path.join(__dirname, '/public')));

    //add routes
    app.use('/api', adsRoutes);
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