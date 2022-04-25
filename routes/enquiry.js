const bodyParser = require('body-parser');
const express = require('express');
const Enquiry = require('../models/Enquiry');
const ensureAuthenticated = require('../helpers/auth')
const router = express.Router();
const alertMessage = require('../helpers/messenger');
// var urlencodeParser = bodyParser.urlencoded({extended: false});

router.get('/create_enquiry', (req, res) => {
	res.render('enquiry/create_enquiry');
});

router.post('/create_enquiry', (req,res) => {
    let name = req.body.name;
    let email = req.body.email;
    let topic = req.body.topic;
    let enquiries = req.body.enquiries;

    Enquiry.create({
        name,
        email,
        topic,
        enquiries
    })
    .then((enquiry) =>{
        let success_msg = "Enquiry submitted successfully";
        res.render('enquiry/create_enquiry', {success_msg});
    })
    .catch(err => console.log(err))
});


router.get('/retrieve_enquiry', (req, res) => {
	Enquiry.findAll({
		// where: {
		// 	userId: req.user.id
		// },
		order: [
			['id', 'ASC']
		],
		raw: true
	})
	.then((enquiries) => {
		// pass object to listVideos.handlebar
		res.render('enquiry/retrieve_enquiry', { 
			enquiries: enquiries
		});
	})
	.catch(err => console.log(err));
});

router.get('/admin_enquiry', (req, res) => {
	Enquiry.findAll()
	.then((enquiries) => {
		console.log(enquiries[0].id,'test')
		if(enquiries){
			res.render('enquiry/admin_enquiry', { 
				enquiries: enquiries
			});
		}
	})
	.catch(err => console.log(err));
});


// Save edited enquiry
router.put('/update_enquiry/:id', (req, res) => {
	let name = req.body.name;
    let email = req.body.email;
    let topic = req.body.topic;
    let enquiries = req.body.enquiries;

	/* console.log(`\n++++++++ Video from session: ${req.session.video.title}`);
	 console.log(`\n++++++++ All videos from session: ${req.session.allVideos}`); */
	// console.log(`URL: ${posterURL}`);
	Enquiry.update({
		name,
        email,
        topic,
        enquiries
	}, {
		where: {
			id: req.params.id
		}
	}).then(enquiry => {
		console.log(enquiry)
		res.redirect('/enquiry/retrieve_enquiry'); // redirect to call router.get(/listVideos...) to retrieve all updated
			// videos
	}).catch(err => console.log(err));
});


router.get('/update_enquiry/:id', (req, res) => {
	Enquiry.findOne({
		where: {
			id: req.params.id
		}
	}).then((enquiry) => {
		if (!enquiry) { // check video first because it could be null.
			alertMessage(res, 'info', 'No such enquiry', 'fas fa-exclamation-circle', true);
			res.redirect('/enquiry/retrieve_enquiry');
		} else {
			// Only authorised user who is owner of video can edit it

				
				res.render('enquiry/update_enquiry', { // call views/video/editVideo.handlebar to render the edit video page
					enquiry
				});
			
		}
	}).catch(err => console.log(err)); // To catch no video ID
});



// router.post('/update_enquiry', (req,res) => {
//     let name = req.body.name;
//     let email = req.body.email;
//     let topic = req.body.topic;
//     let enquiries = req.body.enquiries;

// 	Enquiry.update({
// 		name,
//         email,
//         topic,
//         enquiries
// 	}, {
// 		where: {
// 			id: req.params.id
// 		}
// 	}).then((enquiry) => {
// 		res.render('enquiry/retrieve_enquiry'); 
// 	}).catch(err => console.log(err));
// });

// router.get('/update_enquiry/:id', (req, res) => {
//     Enquiry.findOne({where: {id: req.params.id}})
//     .then(enquiry => {
//         if(enquiry){   
//             res.render("enquiry/update_enquiry")
//         }
//     })
// })



router.get('/delete/:id', (req, res) => {
	let enquiryId = req.params.id;

	// Select * from videos where videos.id=videoID and videos.userId=userID
	Enquiry.findOne({
		attributes: ['id']
	}).then((enquiry) => {
		// if record is found, user is owner of video
		if (enquiry != null) {
			Enquiry.destroy({
				where: {
					id: enquiryId
				}
			}).then(() => {
				res.redirect('/enquiry/retrieve_enquiry'); // To retrieve all videos again
			}).catch(err => console.log(err));
		} 
	});
});


module.exports = router;