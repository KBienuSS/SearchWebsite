const express = require('express');
const usersRouter = express.Router();
const UsersController = require('../controllers/users.controller');

usersRouter.post('/register',UsersController.register);
usersRouter.post('/login',UsersController.login);
usersRouter.get('/user',UsersController.getUser);

module.exports = usersRouter;