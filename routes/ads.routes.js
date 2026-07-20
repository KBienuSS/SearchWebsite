const express = require('express');
const adsRouter = express.Router();
const AdsController = require('../controllers/ads.controller');
const authMiddleware = require('../utils/authMiddleware');
const isOwnerMiddleware = require('../utils/isOwnerMiddleware');
const imageUpload = require('../utils/imageUpload');

adsRouter.get('/ads',AdsController.getAll);
adsRouter.get('/ads/search/:searchPhrase',AdsController.getByPhrase);
adsRouter.get('/ads/:id',AdsController.getById);
// only for log-in users
adsRouter.post('/ads-add',authMiddleware, imageUpload.single('image'), AdsController.create);
// check if the owner of ad is also person who is log-in
adsRouter.delete('/ads-delete/:id',authMiddleware, isOwnerMiddleware, AdsController.remove);
adsRouter.put('/ads-update/:id',authMiddleware, isOwnerMiddleware, imageUpload.single('image'), AdsController.update);

module.exports = adsRouter;