const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const alertMessage = require('../helpers/messenger');
const Admin = require('../models/Admin');
const User = require('../models/User');
var db = require("../config/db");
var mysql = require("mysql");
const Handlebars = require('handlebars');


router.get('/', (req, res) => {
	const title = 'AnimeFest Asia';
	res.render('index', { title: title }) // renders views/index.handlebars
});

router.get('/showLogin', (req, res) => {
	res.render('user/login');
});

router.get('/showRegister', (req, res) => {
	res.render('user/register');
});


//Feedback
router.get('/showFeedback', (req, res) => {
	res.render('./form/addfeedback');
});

router.get('/showRetrieveFeedback', (req, res) => {
	res.render('./form/retrievefeedback',{admin:true});
});

//Event
router.get('/showAddEvent', (req, res) => {
	res.render('./event/addEvent');
});



//User
router.get('/showadminregister', (req, res) => {
	res.render('admins/adminregister',{admin:true});
});

router.get('/admins/retrieveuser', (req, res) => {
	var index = 0
	var indexx = 0
	User.findAll({
		order: [
			['id', 'ASC']
		],
	})
		.then((user) => {
			Admin.findAll({
				order: [
					['id', 'ASC']
				],
			})
				.then((admin) => {
					res.render('admins/retrieveuser', { totaluser: user.length, totaladmin: admin.length, adminzz: admin, userzz: user, admin: true });
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
});

router.get('/showadminlogin', (req, res) => {
	res.render('logins/adminlogin');
});

router.get('/logins/logoutpage', (req, res) => {
	res.render('logins/logoutpage');
});

router.get('/updates/updateadmins', (req, res) => {
	res.render('updates/updateadmins');
});

router.get('/updates/updateusers', (req, res) => {
	res.render('updates/updateusers');
});

router.get('/updates/adminupdateuser/:id', (req, res) => {
	res.render('updates/adminupdateuser', { idz: req.params.id });
});

router.get('/updates/adminupdateadmins/:id', (req, res) => {
	res.render('updates/adminupdateadmins', { idz: req.params.id });
});

router.get('/user/profile', (req, res) => {
	res.render('user/profile');
});

router.get('/admins/adminprofile', (req, res) => {
	res.render('admins/adminprofile', { admin: true });
});

// product listing

router.get('/createProduct', (req, res) => {
	res.render('./product/create_product');
});
router.get('/updateProduct', (req, res) => {
	res.render('./product/update_product');
});
router.get('/retrieveProduct', (req, res) => {
	res.render('./product/retrieve_product');
});
 
// enquiry
router.get('/showEnquiry', (req, res) => {
	res.render('./enquiry/enquiry');
});
router.get('/retrieveEnquiry', (req, res) => {
	res.render('./enquiry/retrieve_enquiry');
});
router.get('/updateEnquiry', (req, res) => {
	res.render('./enquiry/update_enquiry', {admin:false});
});
router.get('/adminEnquiry', (req, res) => {
	res.render('./enquiry/admin_enquiry',{admin:true});
});
router.get('/submissionSuccess', (req, res) => {
	res.render('./enquiry/submission_success');
});

//cart
router.get('/cart', (req, res) => {
	res.render('./cart/cart');
});
router.get('/checkout', (req, res) => {
	res.render('./cart/checkout');
});
router.get('/createCart', (req, res) => {
	res.render('./cart/createCart');
});
router.get('/deleteCart', (req, res) => {
	res.render('./cart/deleteCart');
});
//payment
router.get('/create_payment', (req, res) => {
	res.render('./payment/create_payment');
});
router.get('/retrieve_payment', (req, res) => {
	res.render('./payment/retrieve_payment');
});
router.get('/update_payment', (req, res) => {
	res.render('./payment/update_payment');
});
router.get('/showPayment', (req, res) => {
	res.render('./payment/showPayment');
});
//content

// router.get('/adminViewContent', (req, res) => {
// 	res.render('content/updatecontent');
// });

// router.get('/editcontent', (req, res) => {
// 	res.render('content/editcontent');
// });


router.get('/about', (req, res) => {
	const author = "Robert Lim";
	let success_msg = 'success message';
	let error_msg = 'Error message using error_msg';



	//create an array
	let errors = [];
	errors.push({ text: "First Error Message" });
	errors.push({ text: "Second Error Message" });
	errors.push({ text: "Third Error Message" });
	errors.push({ text: "Forth Error Message" });





	res.render('./about', {
		author: author,
		error_msg: error_msg,
		success_msg: success_msg,
		warning_msg: warning_msg,
	});


});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/logins/logoutpage');
});

module.exports = router;
