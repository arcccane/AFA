const { SequelizeScopeError } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Event = db.define('event', {
    event: {
        type: Sequelize.STRING
    },
    des: {
        type: Sequelize.STRING(2000)
    },
    dateRelease: {
        type: Sequelize.DATE
    },
    startTime: {
        type: Sequelize.STRING
    },
    endTime: {
        type: Sequelize.STRING
    },
    posterURL:{
        type: Sequelize.STRING
    },

});
module.exports = Event;
