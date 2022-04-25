const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Payment = db.define('payment', {
    cardname: {
        type: Sequelize.STRING
    },
    number:{
        type: Sequelize.INTEGER(16)
    },
    expiry: {
        type: Sequelize.STRING
    },
    cvc: {
        type: Sequelize.STRING
    },
});

module.exports = Payment;