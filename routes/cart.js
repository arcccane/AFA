const Express = require('express');
const Router = Express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const sequelize = require('../config/DBConfig');

//Retrieve cart items
Router.get('/cart', async function(req, res){
    console.log("Confirm order page accessed");
    try {
        let cart = await Cart.findAll({
            attributes: ['cart_name', 'cart_price', 'cart_item_quantity'],
            where: {cart_user_id: req.user.id},
            raw: true
        });
    console.log(cart.length);
        // Calculate Subtotal
		let subtotal = 0
		for (let i in cart) {
			subtotal += parseFloat(cart[i].cart_price);
		};

		const total = subtotal;
		
        return res.render('cart/cart', {
            cart: cart,
            subtotal: subtotal,
            total: total,
        });    
    }
    catch (error) {
        console.error("An error occured while trying to retrieve the cart items");
        console.error(error);
        return res.status(500).end();
    }
});

// Add item to cart (checks whether cart already has item and adds to qty if it does)
Router.get('/addToCart/:productid', async function(req, res){
    console.log("Add to cart page accessed");
	try {
        // cartname = name;
        // const product = await Product.findOne();
        // Calculate Qty
        // let isNull = await Cart.findOne();
        // let qty;
        const product = await Product.findOne({where:{productid: req.params.productid}});
        let isNull = await Cart.findOne({ where: { cart_user_id: req.user.id, cart_productid: product.id} });
        let qty;
        if (isNull == null) {
            isNull = true;
            qty = 1;
        }else {
            qty = isNull.cart_item_quantity;
        }
        return res.render('cart/createCart', {
            cart_user_id: req.user.id,
            cart_productid: req.params.productid,
            cart_name: product.name,
            cart_price: product.price,
            cart_item_quantity: qty,
            isNull: isNull,
        });
    }
    catch (error) {
        console.log("Error adding " + req.params.name + " to cart");
        console.log(error);
    }
});

Router.post('/addToCart/:productid', async function (req, res) {    
    try {
        // if (req.body.isNull == "true") {
        const exists = await Cart.findOne({where: {cart_productid: req.params.productid}})
        if(exists != null){
            const update = await Cart.increment('cart_item_quantity', {by: 1, where: {cart_productid: req.params.productid}});
            const updatePrice = await Cart.increment('cart_price', {by: exists.cart_price, where: {cart_productid: req.params.productid}});
        } 
        else{
            var testcart = await Cart.create({
                cart_user_id: req.user.id,
                cart_productid: req.body.cart_productid,
                cart_name: req.body.cart_name,
                cart_price: req.body.cart_price
            });
        }
        console.log("Successfully added item to cart"); 
        // }
        // else{
        //     let quantity = parseInt(req.body.cart_item_quantity) + 1;
        //     const repeatItem = await Cart.update({
        //         cart_item_quantity: quantity
        //     }, { where:{ cart_user_id: req.body.cart_user_id, cart_productid: req.body.cart_productid}});
            
        //     console.log("Successfully added item to cart again");
        // }
    }
    catch (error) {
        console.error("An error occured while trying to add item to cart");
        console.error(error);
        return res.status(500).end();
    }

    return res.redirect("/cart/cart");
});

// Delete item from cart
Router.get('/delete/:cart_name', async function(req, res){
    console.log("Delete item from cart page accessed");
	try {
        const cart = await Cart.findOne({ where: { cart_user_id: req.user.id, cart_name: req.params.cart_name } });
        return res.render('cart/deleteCart', {
            cart_name: req.params.cart_name,
            id : cart.cart_user_id
        })
    }
    catch (error) {
        console.log("Error fetching " + req.params.cart_name + " from cart");
        console.log(error);
    }
});

Router.post('/delete/:cart_name', async function (req, res) {    
    try {
        const deleteCart = await Cart.destroy({
             where:{cart_user_id: req.user.id, cart_name: req.params.cart_name}
            });
        
        console.log("Successfully deleted cart item");
    }
    catch (error) {
        console.error("An error occured while trying to delete the menu item");
        console.error(error);
        return res.status(500).end();
    }


    return res.redirect("/cart/cart");
});
 

module.exports = Router;