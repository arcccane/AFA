// const {Sequelize, Model} = require('sequelize');
// const db = require('../config/DBConfig');
// class Cart extends Model {

// }

// Cart.init({
//     cart_user_id: {
//         type: Sequelize.CHAR(36),
//         allowNull: false
//     },
//     cart_productid: {
//         type: Sequelize.CHAR(36),
//         allowNull: false
//     },
//     cart_name: {
//         type: Sequelize.STRING(64),
//         allowNull: false
//     },
//     cart_price: {
//         type: Sequelize.DECIMAL(10,2),
//         allowNull: false
//     },
//     cart_item_quantity: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         defaultValue: 1
//     },
// }, {
//     sequelize: db.sequelize,
//     modelName: 'cart',
// });

// module.exports = {Cart};

const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Database = require('../config/db');
const Cart = db.define('cart', {
            cart_user_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            cart_productid: {
                type: Sequelize.STRING,
                allowNull: false
            },
            cart_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            cart_price: {
                type: Sequelize.STRING,
                allowNull: false
            },
            cart_item_quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },     
        }, {
            timestamps: false,
            sequelize: Database.sequelize,
            modelName: 'carts',   
        }
);

module.exports = Cart;