const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Product = db.define('product', {
    name: {
        type: Sequelize.STRING
    },
    category:{
        type: Sequelize.STRING
    },
    productid: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.STRING 
    },
    manufacturer: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    imageURL:{
        type: Sequelize.STRING
    },
    category: {
        type: Sequelize.STRING
    }
});
module.exports = Product;