const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../utils/authMiddleware');
const imageUpload = require('../utils/imageUpload');

authRouter.post('/register', imageUpload.single('avatar'), AuthController.register);
authRouter.post('/login',AuthController.login);
authRouter.delete('/logout', authMiddleware, AuthController.logout);
authRouter.get('/user',authMiddleware, AuthController.getUser);

module.exports = authRouter;