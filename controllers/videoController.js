const mongoose = require('mongoose');
const multer = require('multer');
const uuid = require('uuid');
const {Video} = require('./../models/Video');
const notifier = require('node-notifier');

// we provide fields array for multer to get files form two form fields 'video' and 'poster'
const multerFields = [
    {name: 'video', maxCount: 1},
    {name: 'poster', maxCount: 1}
];

// configuring storage options and custom file filter for multer
const multerOptions = {
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null,'public/uploads');
        },
        filename: function(req, file, cb) {
            const extension = file.mimetype.split('/')[1];
            var fileName = `${uuid.v4()}.${extension}`;
            cb(null, fileName);
        }
    }),
    fileFilter(req, file, next) {
        const isValid = file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/');
        if(isValid) {
            next(null, true);
        } else {
            next({message: 'This file type is not allowed'}, false);
        }
    }
};

// render main page for videos
exports.getVideos = (req, res) => {
    Video.find().then((videos) => {
        res.render('videos', {title: 'Videos', videos});
    }).catch((err) => {
        res.send(err);
    });
};

// render page for adding videos
exports.addVideo = (req, res) => {
    res.render('editVideo', {title: 'Add video'});
};

// upload function which uses multer for file uploads
exports.upload = multer(multerOptions).fields(multerFields);

// create new video and save data in the database
exports.createVideo = (req, res) => {
    req.body.author = req.user._id;
    req.body.video = req.files.video[0].filename;
    req.body.poster = req.files.poster[0].filename;
    var video = new Video(req.body);
    // console.log(req.files);

    video.save().then((video) => {
        notifier.notify('Successfully added new video!');
        res.redirect('/videos');
        // res.json(video);
    }).catch((err) => {
        notifier.notify('Error occured while adding a new video!');
        res.redirect('/add');
    });
};

// get video by ID and redirect to edit page
exports.updateVideo = (req, res) => {
    var id = req.params.id;

    Video.findByIdAndUpdate({_id: id}, req.body, {new: true}).then((video) => {
        res.redirect(`/videos/${video._id}`);
    }).catch((err) => {
        res.send(err);
    });
};

// render edit page for video
exports.editVideo = (req, res) => {
    var id = req.params.id;
    Video.findOne({_id: id}).then((video) => {
        res.render('editVideo', {title: `Edit video`,video});
    }).catch((err) =>{
        res.status(400).send(err);
    });
};

// get video by ID
exports.getVideoById = (req, res, next) => {
    Video.findOne({_id: req.params.id}).then((video) => {
        res.render('video', {title: `${video.title}`, video});
    }).catch((err) => {
        res.send(err);
    });
};

// find videos by author ID and render page for displaying user videos
exports.getUserVideos = (req, res) => {
    const id = req.params.id;

    Video.find({author: id}).then((videos) => {
        res.render('userVideos', {videos});
    }).catch((err) => {
        notifier.notify('No videos found');
    });
};

// remove videos using video and author IDs
exports.removeVideo = (req, res) => {
    const id = req.params.id;

    Video.findOneAndRemove({
        _id: id,
        author: req.user._id
    }).then((video) => {
        notifier.notify('Successfully deleted the video');
        res.redirect('/videos');
    }).catch((err) => {
        notifier.notify('Error occured while deleting a video');
        // res.redirect('back');
        res.send(err);
    });
};

// exports.searchVideos = (req, res) => {

// }