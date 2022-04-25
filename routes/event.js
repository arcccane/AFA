const express = require('express');
const router = express.Router();
const moment = require('moment');
const Event = require('../models/Event');
const alertMessage = require('../helpers/messenger');




// Required for file upload
const fs = require('fs');
const upload = require('../helpers/imageUpload');
const sequelize = require('../config/DBConfig');
const sendemail = require('./sendmail');
// const { where } = require('sequelize/types');





// Upload poster
router.post('/upload', (req, res) => {
	// Creates user id directory for upload if not exist
	if (!fs.existsSync('./public/uploads/event' )){
	fs.mkdirSync('./public/uploads/event' );
	}
	upload(req, res, (err) => {
	if (err) {
	res.json({file: '/img/no-image.jpg', err: err});
	} else {
	if (req.file === undefined) {
	res.json({file: '/img/no-image.jpg', err: err});
	} else {
	res.json({file: `/uploads/event/${req.file.filename}`});
	}
	}
	});
	})


router.get('/customerEvent', (req, res) => {
	
	Event.findAll({
		// where: {
		// 	userId: req.user.id
		// },
		order: [
			['event', 'ASC']
		],
		raw: true
	})
	.then((events) => {
		res.render('event/customerEvent', { 
			events: events
		});
	})
	.catch(err => console.log(err));
});


router.get('/showAddEvent', (req, res) => {
	res.render('event/addEvent');
});

// Shows edit event page
router.get('/edit/:id', (req, res) => {
	Event.findOne({
		where: {
			id: req.params.id
		}
	}).then((event) => {
		if (!event) { // check video first because it could be null.
			alertMessage(res, 'info', 'No such event', 'fas fa-exclamation-circle', true);
			res.redirect('/event/listEvent');
		} else {
			// Only authorised user who is owner of video can edit it

				
				res.render('event/editEvent', { // call views/video/editVideo.handlebar to render the edit video page
					event
				});
			
		}
	}).catch(err => console.log(err)); // To catch no video ID
});




router.post('/addEvent', (req, res) => {
	let event = req.body.event;
	let des = req.body.des;
	let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
	let starttime = req.body.starttime;
	let endtime = req.body.endtime;
	let posterURL = req.body.posterURL;
	

	// Multi-value components return array of strings or undefined
	Event.create({
		event,
		des,
		dateRelease,
		startTime: starttime,
		endTime: endtime,
		posterURL,
	}).then((event) => {
        let success_msg = " Event created successfully";
        res.render('event/addEvent', {success_msg});
	}).catch(err => console.log(err))
});






// Save edited video
router.put('/saveEditedEvent/:id', (req, res) => {
	let event = req.body.event;
	let des = req.body.des;
	let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
	let startTime = req.body.starttime;
	let endTime = req.body.endtime;
	let posterURL = req.body.posterURL;
	console.log(startTime);
	console.log(endTime);

	/* console.log(`\n++++++++ Video from session: ${req.session.video.title}`);
	 console.log(`\n++++++++ All videos from session: ${req.session.allVideos}`); */
	// console.log(`URL: ${posterURL}`);
	Event.update({
		event,
		des,
		dateRelease,
		startTime,
		endTime,
		posterURL,
	}, {
		where: {
			id: req.params.id
		}
	}).then(event => {
		console.log(event)
		res.redirect('/event/listEvent'); // redirect to call router.get(/listVideos...) to retrieve all updated
			// videos
	}).catch(err => console.log(err));
});


// List videos belonging to current logged in user
router.get('/listEvent', (req, res) => {
	Event.findAll({
		// where: {
		// 	userId: req.user.id
		// },
		order: [
			['event', 'ASC']
		],
		raw: true
	})
	.then((events) => {
		// pass object to listVideos.handlebar
		res.render('event/listEvent', { 
			events: events
		});
	})
	.catch(err => console.log(err));
});

router.get('/delete/:id',  (req, res) => {
	let eventId = req.params.id;
	// Select * from videos where videos.id=videoID and videos.userId=userID
	Event.findOne({
		// where: {
		// 	id: eventId,
		// },
		attributes: ['id']
	}).then((event) => {
		// if record is found, user is owner of video
		if (event != null) {
			Event.destroy({
				where: {
					id: eventId
				}
			}).then(() => {
				alertMessage(res, 'info', 'Event deleted', 'far fa-trash-alt', true);
				res.redirect('/event/listEvent'); // To retrieve all videos again
			}).catch(err => console.log(err));
		} 
	});
});
module.exports = router;