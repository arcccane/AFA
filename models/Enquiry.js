const { SequelizeScopeError } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Enquiry = db.define('enquiry', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    topic: {
        type: Sequelize.STRING
    },
    enquiries: {
        type: Sequelize.STRING(2000)
    },
});

module.exports = Enquiry;
