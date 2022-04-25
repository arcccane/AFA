const express = require('express');
const router = express.Router();
// const alertMessage = require('../helpers/messenger');
// const ensureAuthenticated = require('../helpers/auth')
// const moment = require('moment')
const Payment = require('../models/Payment');
// const fs = require('fs');
// const sequelize = require('../config/DBConfig');

router.get('/create_payment', (req, res) => {
    res.render('payment/create_payment');
});

router.post('/create_payment', (req, res) => {
    let cardname = req.body.cardname;
    let number = req.body.number;
    let expiry = req.body.expiry;
    let cvc = req.body.cvc;

    Payment.create({
        cardname,
        number,
        expiry,
        cvc
    })
        .then((payment) => {
            let success_msg = "Payment details submitted successfully";
            res.redirect('/retrieve_payment');
        })
        .catch(err => console.log(err))
});

// router.get('/showPayment', (req, res) => {
//     Payment.findAll({
//         // where: {
//         // 	id: req.id
//         // },
//         order: [
//             ['cardname', 'ASC']
//         ],
//         raw: true
//     })
//         .then((payments) => {
//             res.render('payment/payment', {
//                 payments: payments
//             });
//         })
//         .catch(err => console.log(err));
// });

router.get('/retrieve_payment', (req, res) => {
    Payment.findAll({
        order: [
            ['cardname', 'ASC']
        ],
        raw: true
    })
        .then((payments) => {
            res.render('payment/retrieve_payment', {
                payments: payments
            });
        })
        .catch(err => console.log(err));
});

router.post('/update_payment/:cardname', (req, res) => {
	let cardname = req.body.cardname;
    let number = req.body.number
    let expiry = req.body.expiry;
    let cvc = req.body.cvc;
	Payment.update({
        cardname,
        number,
        expiry,
        cvc
	}, {
	}).then(payment => {
		console.log(payment)
		res.redirect('/payment/retrieve_payment');
	}).catch(err => console.log(err));
});

router.get('/update_payment/:cardname', (req, res) => {
    Payment.findOne({where: {cardname: req.params.cardname}})
    .then(payment => {
        if(payment){   
            res.render("/payment/update_payment", {payment})
        }
    })
})

router.get('/delete/:cardname', (req, res) => {
    Payment.findAll()
    .then((payment) => {
        if (payment != null) {
            Payment.destroy({
                where: {
                    id: paymentId
                }
            }).then(() => {
                res.redirect('/payment/retrieve_payment'); 
            }).catch(err => console.log(err));
        }
    });
});

module.exports = router;