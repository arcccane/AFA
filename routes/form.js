const express = require('express');
const Form = require('../models/Form');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');


router.get('/addfeedback', (req, res) => {
	res.render('form/addfeedback');
});

router.post('/addfeedback', (req,res) => {
    let rating = req.body.rating;
    let fb = req.body.fb.slice(0,100);

    Form.create({
        rating,
        fb
    })
    .then((form) =>{
        let success_msg = " Feedback submitted successfully";
        res.render('form/addfeedback', {success_msg});
    })
    .catch(err => console.log(err))
});

router.get('/retrievefeedback', (req, res) => {
	Form.findAll({
		// where: {
		// 	id: req.id
		// },
		order: [
			['rating', 'ASC']
		],
		raw: true
	})
	.then((forms) => {
		res.render('form/retrievefeedback', { 
			forms: forms
		});
	})
	.catch(err => console.log(err));
});


router.get('/delete/:id', (req, res) => {
	let formId = req.params.id;

	// Select * from videos where videos.id=videoID and videos.userId=userID
	Form.findOne({
		// where: {
		// 	id: videoId,
		// 	userId: userId
		// },
		attributes: ['id', 'userId']
	}).then((form) => {
		// if record is found, user is owner of video
		if (form != null) {
			Form.destroy({
				where: {
					id: formId
				}
			}).then(() => {
				alertMessage(res, 'info', 'Feedback deleted', 'far fa-trash-alt', true);
				res.redirect('/form/retrievefeedback'); // To retrieve all videos again
			}).catch(err => console.log(err));
		} 
	});
});

module.exports = router;