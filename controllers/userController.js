const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const notifier = require('node-notifier');
// const toastr = require('toastr');

exports.loginForm = (req, res) => {
     res.render('login', {title: 'Login'});
};

exports.registerForm = (req, res) => {
    res.render('register', {title: 'Register'});
};

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password','Password can not be empty').notEmpty();
    req.checkBody('confirm-password', 'Can not be empty').notEmpty();
    req.checkBody('confirm-password', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if(errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('register', {title: 'Register', body: req.body, flashes: req.flash()});
        return;
    }
    next();
};

exports.register = (req, res, next) => {
    const user = new User({email: req.body.email, name: req.body.name});
    const register = promisify(User.register, User);

    register(user, req.body.password).then(function(result) {
        next();
    }).catch((err) => {
        notifier.notify('This username is already ccreated!');
        // toastr.warning('The username is already taken');
        next();
    });
};

exports.profile = (req, res) => {
    res.render('profile', {title: 'Profile'});
};

exports.updateSettings = (req, res) => {
    const updates = {
        name: req.body.name,
        email: req.body.email
    };

    User.findByIdAndUpdate(
        req.user._id,
        {$set: updates},
        {new: true, runValidators: true, context: 'query'}
    ).then((user) => {
        notifier.notify('Profile successfully updated!');
        res.redirect('/profile');
    }).catch((err) => {
        notifier.notify('Error occured while updating profile!');
    });
};