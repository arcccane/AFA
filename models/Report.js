const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Report = db.define('report', {
    Reported_Id: {
        type: Sequelize.INTEGER
    },
    Reported_UserId: {
        type: Sequelize.INTEGER
    },
    Reported_Name: {
        type: Sequelize.STRING
    },
    reason: {
        type: Sequelize.STRING
    }
});
module.exports = Report;