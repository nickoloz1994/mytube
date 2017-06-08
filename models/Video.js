const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const videoSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Please provide the title of the video!'
    },
    description: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    video: {
        type: String,
        required: 'Please provide the video!'
    },
    poster: {
        type: String,
        required: 'Please provide the poster!'
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Author must be provided!'
    }
});

videoSchema.index({
    name: 'text',
    description: 'text'
});

var Video = mongoose.model('Video', videoSchema);

module.exports = {Video};