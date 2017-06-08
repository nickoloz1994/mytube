const express = require('express');
const router = express.Router();
const videoController = require('./../controllers/videoController');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

router.get('/', videoController.getVideos);
router.get('/videos', videoController.getVideos);
router.get('/add', videoController.addVideo);
router.post('/add',
    videoController.upload,
    videoController.createVideo
);
router.post('/add/:id',
    videoController.upload,
    videoController.updateVideo
);
router.get('/videos/:id/edit', videoController.editVideo);
router.get('/videos/:id', videoController.getVideoById);
router.post('/remove/:id', videoController.removeVideo);
router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);
router.post('/register',
    userController.validateRegister,
    userController.register,
    authController.login
);
router.get('/logout', authController.logout);
router.post('/login', authController.login);
router.get('/profile', userController.profile);
router.post('/profile', userController.updateSettings);
router.get('/profile/:id/videos', videoController.getUserVideos);

// router.get('/api/search', videoController.searchVideos);


module.exports = router;