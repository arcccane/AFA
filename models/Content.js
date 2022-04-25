const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Content = db.define('content', {
    fname: {
        type: Sequelize.STRING
    },
    lname: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    age: {
        type: Sequelize.INTEGER
    },
    gender: {
        type: Sequelize.STRING
    },
    sname: {
        type: Sequelize.STRING
    },
    dateOfSub: {
        type: Sequelize.DATE
    },
    subURL: {
		type: Sequelize.STRING(512),
	},
    likes:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});
module.exports = Content;