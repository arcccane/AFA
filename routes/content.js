const express = require('express');
const Content = require('../models/Content');
const Report = require('../models/Report');;
const router = express.Router();
const moment = require('moment');
const ensureAuthenticated = require('../helpers/auth');
const fs = require('fs');
const upload = require('../helpers/contentUpload');
const alertMessage = require('../helpers/messenger');

router.get('/showAddContent', ensureAuthenticated, (req, res) => {
    res.render('content/addContent');
});

router.post('/addContent', (req, res) => {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let phone = req.body.phone;
    let age = req.body.age;
    let gender = req.body.gender;
    let sname = req.body.sname;
    let dateOfSub = req.body.dateOfSub;
    let subURL = req.body.subURL;
    let likes = req.body.likes;
    let userId = req.user.id;
    let success_msg = " Submission Successful! ";
    Content.create({
        fname,
        lname,
        phone,
        age,
        gender,
        sname,
        dateOfSub,
        subURL,
        likes,
        userId
    }).then((content) => {
        alertMessage(res, 'success', success_msg, 'fas fa-sign-in-alt', true);
        res.redirect('/content/viewOwnContent');
    })
        .catch(err => console.log(err))
});

router.get('/viewAllContent', (req, res) => {
    Content.findAll({
        order: [
            ['likes', 'DESC']
        ],
        raw: true
    })
        .then((contents) => {
            res.render('content/viewAllContent', {
                contents: contents,
            });
        })
        .catch(err => console.log(err));
});

router.get('/viewOwnContent', ensureAuthenticated, (req, res) => {
    Content.findAll({
        where: {
            userId: req.user.id
        },
        order: [
            ['dateOfSub', 'DESC']
        ],
        raw: true
    })
        .then((contents) => {
            res.render('content/viewOwnContent', {
                contents: contents,
            });
        })
        .catch(err => console.log(err));
});

router.get('/updateContent/:id', ensureAuthenticated, (req, res) => {
    Content.findOne({
        where: {
            id: req.params.id
        }
    }).then((content) => {
        if (!content) {
            alertMessage(res, 'info', 'No such submission', 'fas fa-exclamation-circle', true);
            res.redirect('/content/viewOwnContent');
        } else {
            if (req.user.id === content.userId) {
                res.render('content/updateOwnContent', {
                    content
                });
            } else {
                alertMessage(res, 'danger', 'Unauthorised access', 'fas fa-exclamation-circle', true);
                res.redirect('/logout');
            }
        }
    }).catch(err => console.log(err));
});

router.put('/saveUpdatedContent/:id', ensureAuthenticated, (req, res) => {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let phone = req.body.phone;
    let age = req.body.age;
    let gender = req.body.gender;
    let sname = req.body.sname;
    let dateOfSub = req.body.dateOfSub;
    let subURL = req.body.subURL;
    let contentId = req.params.id;
    let success_msg = " Content " + contentId + " updated successfully! ";
    Content.update({
        fname,
        lname,
        phone,
        age,
        gender,
        sname,
        dateOfSub,
        subURL
    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        alertMessage(res, 'success', success_msg, 'fas fa-sign-in-alt', true);
        res.redirect('/content/viewOwnContent');
    }).catch(err => console.log(err));
})

router.get('/deleteContent/:id', ensureAuthenticated, (req, res) => {
    let contentId = req.params.id;
    let userId = req.user.id;
    let success_msg = " Content " + contentId + " deleted successfully! ";
    Content.findOne({
        where: {
            id: contentId,
            userId: userId
        },
        attributes: ['id', 'userId']
    }).then((content) => {
        if (content != null) {
            Content.destroy({
                where: {
                    id: contentId
                }
            }).then(() => {
                alertMessage(res, 'info', success_msg , 'far fa-trash-alt', true);
                res.redirect('/content/viewOwnContent');
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Unauthorised access', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    });
});

router.post('/upload', ensureAuthenticated, (req, res) => {
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id);
    }
    upload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/no-image.jpg', err: err });
        } else {
            if (req.file === undefined) {
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                res.json({ file: `/uploads/${req.user.id}/${req.file.filename}` });
            }
        }
    });
})

router.get('/adminViewContent', ensureAuthenticated,(req, res) => {
    Content.findAll({
        order: [
            ['likes', 'DESC']
        ],
        raw: true
    })
        .then((contents) => {
            res.render('content/adminViewContent',{
                contents: contents,
                admin:true
            });
        })
        .catch(err => console.log(err));
});

router.get('/adminUpdateContent/:id', ensureAuthenticated, (req, res) => {
    Content.findOne({
        where: {
            id: req.params.id
        }
    }).then((content) => {
        if (!content) {
            alertMessage(res, 'info', 'No such submission', 'fas fa-exclamation-circle', true);
            res.redirect('/content/adminViewContent');
        } else {
            res.render('content/adminUpdateContent', {
                content
            });
        }
    }).catch(err => console.log(err));
});

router.put('/adminSaveUpdatedContent/:id', ensureAuthenticated, (req, res) => {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let phone = req.body.phone;
    let age = req.body.age;
    let gender = req.body.gender;
    let sname = req.body.sname;
    let dateOfSub = req.body.dateOfSub;
    let subURL = req.body.subURL;
    let userId = req.user.id;
    let contentId = req.params.id;
    let success_msg = " Submission " + contentId + " of User ID " + userId + " updated! ";
    Content.update({
        fname,
        lname,
        phone,
        age,
        gender,
        sname,
        dateOfSub,
        subURL
    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        alertMessage(res, 'success', success_msg, 'fas fa-sign-in-alt', true);
        res.redirect('/content/adminViewContent');
    }).catch(err => console.log(err));
})

router.get('/adminDeleteContent/:id', ensureAuthenticated, (req, res) => {
    let contentId = req.params.id;
    let userId = req.user.id;
    let success_msg = " Submission " + contentId + " of user ID " + userId + " deleted! ";
    Content.findOne({
        where: {
            id: contentId,
        },
    }).then((content) => {
        if (content != null) {
            Content.destroy({
                where: {
                    id: contentId
                }
            }).then(() => {
                alertMessage(res, 'info', success_msg , 'far fa-trash-alt', true);
                res.redirect('/content/adminViewContent');
            }).catch(err => console.log(err));
        }
    });
});

router.post('/posts/:id/act', ensureAuthenticated, (req, res) => {
    const action = req.body.action;
    const counter = action === 'Like' ? 1 : -1;
    Content.findOne({
        where: {
            id: req.params.id
        }
    }).then((content) => {
        if (content != null) {
            Content.increment({
                likes:counter
            }, {
                where: {
                    id: req.params.id
                }
            }).then(() => { 
                alertMessage(res, 'info', 'success' , 'far fa-trash-alt', true);
            }).catch(err => console.log(err));
        }
    });
});

router.get('/showAddReport', ensureAuthenticated, (req, res) => {
    res.render('content/addReport',{admin:true});
});

router.post('/addReport/:id', ensureAuthenticated,(req, res) => {
    let Reported_Name = req.body.name;
    let Reported_Id = req.body.targetId;
    let Reported_UserId = req.body.targetUserId;
    let reason = req.body.reason;
    let userId = req.user.id;
    let success_msg = " Reported post! ";
    Report.create({
        Reported_Name,
        Reported_Id,
        Reported_UserId,
        reason,
        userId
    }).then((report) => {
        alertMessage(res, 'success', success_msg, 'fas fa-sign-in-alt', true);
        res.redirect('/content/viewOwnContent');
    })
        .catch(err => console.log(err))
});

router.get('/reportContent/:id', ensureAuthenticated,(req, res) => {
    Content.findOne({
        where: {
            id: req.params.id
        }
    }).then((content) => {
        if (!content) {
            alertMessage(res, 'info', 'No such submission', 'fas fa-exclamation-circle', true);
            res.redirect('/content/adminViewContent');
        } else {
            res.render('content/addReport', {
                content,
            });
        }
    }).catch(err => console.log(err));
});

router.get('/adminViewReports',ensureAuthenticated, (req, res) => {
    Report.findAll({
        order: [
            ['id', 'ASC']
        ],
        raw: true
    })
        .then((reports) => {
            res.render('content/adminViewReports',{
                reports: reports,
                admin:true
            });
        })
        .catch(err => console.log(err));
});

router.get('/adminDeleteReport/:id', ensureAuthenticated, (req, res) => {
    let reportId = req.params.id;
    let success_msg = " Report " + reportId + " deleted! ";
    Report.findOne({
        where: {
            id: reportId,
        },
    }).then((report) => {
        if (report != null) {
            Report.destroy({
                where: {
                    id: reportId
                }
            }).then(() => {
                alertMessage(res, 'info', success_msg , 'far fa-trash-alt', true);
                res.redirect('/content/adminViewReports');
            }).catch(err => console.log(err));
        }
    });
});

module.exports = router;