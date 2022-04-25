const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');



// Login Form POST => /user/login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/profile', // Route to /video/listVideos URL
        failureRedirect: '/showLogin', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error message using the
message given by the strategy's verify callback, if any. When a failure occur passport passes the message
object as error */
    })(req, res, next);
});

router.post('/updateusers', (req, res, next) => {
    User.findOne({
        where: {
            id: user.id
        }
    }).then((user) => {
        if (!user) { // check video first because it could be null.
            alertMessage(res, 'info', 'No such video', 'fas fa-exclamation-circle', true);
            res.redirect('/user/profile');
        } else {
            // Only authorised user who is owner of video can edit it
            if (req.user.id === user.userId) {
                res.render('updates/updateusers'// call views/video/editVideo.handlebar to render the edit video page 
                );
            } else {
                alertMessage(res, 'danger', 'Unauthorised access to video', 'fas fa-exclamation-circle', true);
                res.redirect('/logout');
            }
        }
    }).catch(err => console.log(err)); // To catch no video ID
});

router.put('/saveEditedProfile/:id', (req, res) => {
    console.log('test test update profile');
    let err = []
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let username = req.body.username;


    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            let password = hash;
            console.log(password);
            User.update({
                firstname,
                lastname,
                email,
                username,
                password
            }, {
                where: {
                    id: req.params.id
                }
            }).then(() => {
                console.log(password)
                res.redirect('/user/profile'); // redirect to call router.get(/listVideos...) to retrieve all updated
                // videos
            }).catch(err => console.log(err));
        });
    });
});


router.get('/userdelete/:id', (req, res) => {
    let userzId = req.params.id;
    // Select * from videos where videos.id=videoID and videos.userId=userID
    User.findOne({
        where: {
            id: userzId,
        },
        attributes: ['id']
    }).then((user) => {
        // if record is found, user is owner of video
        if (user != null) {
            User.destroy({
                where: {
                    id: req.params.id
                }
            }).then(() => {
                alertMessage(res, 'info', 'Account deleted', 'far fa-trash-alt', true);
                res.redirect('/'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Unauthorised access to video', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    });
});


// User register URL using HTTP post => /user/register
router.post('/register', (req, res) => {
    let errors = []

    let { firstname, lastname, email, username, password, password2 } = req.body;

    if (password !== password2) {
        errors.push({ text: "Password does not match." });
    }

    if (password.length < 4) {
        errors.push({ text: "Password must be at least 4 characters." });
    }
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            password = hash;
        });
    });
    bcrypt.hash('bacon', 8, function (err, hash) {
    });

    if (errors.length > 0) {
        res.render('user/register', {
            errors,
            firstname,
            lastname,
            email,
            username,
            password,
            password2
        });
    } else {
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) {
                    res.render('user/register', {
                        error: user.email + 'already registered',
                        firstname,
                        lastname,
                        email,
                        username,
                        password,
                        password2
                    });
                } else {
                    User.create({ firstname, lastname, email, username, password, type: "userzz" })
                        .then(user => {
                            alertMessage(res, 'success', user.username + ' added. Please login',
                                'fas fa-sign-in-alt', true);
                            res.redirect('/showLogin');
                        })
                        .catch(err => console.log(err));
                }
            });

    }
});


module.exports = router;
