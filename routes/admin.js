const Admin = require('../models/Admin');
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');



// Login Form POST => /user/login
router.post('/adminlogin', (req, res, next) => {
    passport.authenticate('admin', {
        successRedirect: '/admins/retrieveuser', // Route to /video/listVideos URL
        failureRedirect: '/showadminlogin', // Route to /login URL
        failureFlash: true,
        /* Setting the failureFlash option to true instructs Passport to flash an error message using the
message given by the strategy's verify callback, if any. When a failure occur passport passes the message
object as error */
    })(req, res, next);
});


// User register URL using HTTP post => /user/register
router.post('/adminregister', (req, res) => {
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
        res.render('admins/adminregister', {
            errors,
            firstname,
            lastname,
            email,
            username,
            password,
            password2
        });
    } else {
        Admin.findOne({ where: { email: req.body.email } })
            .then(admin => {
                if (admin) {
                    res.render('admins/adminregister', {
                        error: user.email + 'already registered',
                        firstname,
                        lastname,
                        email,
                        username,
                        password,
                        password2
                    });
                } else {
                    Admin.create({ firstname, lastname, email, username, password, type: "adminzz" })
                        .then(admin => {
                            alertMessage(res, 'success', admin.username + ' added. Please login',
                                'fas fa-sign-in-alt', true);
                            res.redirect('/showadminlogin');
                        })
                        .catch(err => console.log(err));
                }
            });

    }
});

router.post('/updateadmins', (req, res, next) => {
    Admin.findOne({
        where: {
            id: req.params.id
        }
    }).then((admin) => {
        if (!admin) { // check video first because it could be null.
            alertMessage(res, 'info', 'No such video', 'fas fa-exclamation-circle', true);
            res.redirect('/admins/adminprofile');
        } else {
            // Only authorised user who is owner of video can edit it
            if (req.user.id === user.userId) {
                console.log("Displaying Update Admin Page. - profile")
                res.render('updates/updateadmins'// call views/video/editVideo.handlebar to render the edit video page 
                );
            } else {
                alertMessage(res, 'danger', 'Unauthorised access to Account', 'fas fa-exclamation-circle', true);
                res.redirect('/logout');
            }
        }
    }).catch(err => console.log(err)); // To catch no video ID
});

router.put('/saveEditedadminProfile/:id', (req, res) => {
    console.log('Admin has updated their profile. - adminprofile');
    let err = []
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let username = req.body.username;


    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            let password = hash;
            console.log(password);
            Admin.update({
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
                res.redirect('/admins/adminprofile'); // redirect to call router.get(/listVideos...) to retrieve all updated
                // videos
            }).catch(err => console.log(err));
        });
    });
});


router.get('/admindelete/:id', (req, res) => {
    let adminzId = req.params.id;
    // Select * from videos where videos.id=videoID and videos.userId=userID
    Admin.findOne({
        where: {
            id: adminzId,
        },
        attributes: ['id']
    }).then((admin) => {
        // if record is found, user is owner of video
        if (admin != null) {
            Admin.destroy({
                where: {
                    id: req.params.id
                }
            }).then(() => {
                console.log("Admin Account has been Deleted. - adminprofile")
                alertMessage(res, 'info', 'Admin Account has been Deleted', 'far fa-trash-alt', true);
                res.redirect('/'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Unauthorised access to Account', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    });
});

router.put('/saveadminEditedProfile/:id', (req, res) => {
    console.log('Saved Admin edited Profile. - adminprofile');
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
                res.redirect('/admins/retrieveuser'); // redirect to call router.get(/listVideos...) to retrieve all updated
                // videos
            }).catch(err => console.log(err));
        });
    });
});

router.get('/admindeleteuser/:id', (req, res) => {
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
                console.log('User Account has been Deleted. - retrieveuser')
                alertMessage(res, 'info', 'User Account has been Deleted', 'far fa-trash-alt', true);
                res.redirect('/admins/retrieveuser'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Unauthorised access to Account', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    });
});

router.put('/adminsaveadminEditedProfile/:id', (req, res) => {
    console.log('Admin has updated profile - retreiveuser');
    let err = []
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let username = req.body.username;


    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            let password = hash;
            console.log(password);
            Admin.update({
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
                res.redirect('/admins/retrieveuser'); // redirect to call router.get(/listVideos...) to retrieve all updated
                // videos
            }).catch(err => console.log(err));
        });
    });
});

router.get('/admindeleteadmin/:id', (req, res) => {
    let adminzId = req.params.id;
    // Select * from videos where videos.id=videoID and videos.userId=userID
    Admin.findOne({
        where: {
            id: adminzId,
        },
        attributes: ['id']
    }).then((admin) => {
        // if record is found, user is owner of video
        if (admin != null) {
            Admin.destroy({
                where: {
                    id: req.params.id
                }
            }).then(() => {
                console.log("Admin Account has been Deleted. - retrieveuser")
                alertMessage(res, 'info', 'Admin Account has been Deleted.', 'far fa-trash-alt', true);
                res.redirect('/admins/retrieveuser'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Unauthorised access to Account', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    });
});

module.exports = router;
