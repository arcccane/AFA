const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Form = db.define('form', {
    rating: {
        type: Sequelize.STRING
    },
    fb: {
        type: Sequelize.STRING(2000)
    }
});
module.exports = Form;
