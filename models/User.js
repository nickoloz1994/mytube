const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongoErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [
            validator.isEmail,
            'Invalid email address'
        ],
        required: 'Please enter email address'
    },
    name: {
        type: String,
        required: 'Please supply your name',
        trim: true
    }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
userSchema.plugin(mongoErrorHandler);

module.exports = mongoose.model('User', userSchema);