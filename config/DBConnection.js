const mySQLDB = require('./DBConfig');
const user = require('../models/User');
const admin = require('../models/Admin')
const video = require('../models/Video');
const form = require('../models/Form');
const event = require('../models/Event');
const content = require('../models/Content');
const enquiry = require('../models/Enquiry');
const cart = require('../models/Cart');
const product = require('../models/Product');
const payment = require('../models/Payment');

const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('afaproject database connected');
        })
        .then(() => {
            /*
            Defines the relationship where a user has many videos.
            In this case the primary key from user will be a foreign key
            in video.
            */
            user.hasMany(form);
            user.hasMany(content);
            user.hasMany(video);
            mySQLDB.sync({ // Creates table if none exists
                force: drop
            }).then(() => {
                console.log('Create tables if none exists')
            }).catch(err => console.log(err))
        })
        .catch(err => console.log('Error: ' + err));
};
module.exports = { setUpDB };