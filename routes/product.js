const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth')
const moment = require('moment')
const Product = require('../models/Product');
const fs = require('fs');
const upload = require('../helpers/productUpload');
const sequelize = require('../config/DBConfig');
// var urlencodeParser = bodyParser.urlencoded({ extended: false });

router.get('/create_product', (req, res) => {
    res.render('product/create_product',{admin:true});
});

router.post('/createProduct', (req, res) => {
    let name = req.body.name;
    let category = req.body.category
    let productid = req.body.productid;
    let price = req.body.price;
    let manufacturer = req.body.manufacturer;
    let description = req.body.description;
    let imageURL = req.body.imageURL;

    if(!name){
        error.push({text: "Please add Name"});
    }
    if(!category){
        error.push({text: "Please add Category"});
    }
    if(!productid){
        error.push({text: "Please add Product ID"});
    }
    if(!price){
        error.push({text: "Please add Price"});
    }
    if(!manufacturer){
        error.push({text: "Please add Manufacturer"});
    }
    if(!description){
        error.push({text: "Please add Description"});
    }
    if(!imageURL){
        error.push({text: "Please add Image"});
    }

    Product.create({
        name,
        category,
        productid,
        price,
        manufacturer,
        description,
        imageURL
    })
.then((product) => {
            let success_msg = "Product details submitted successfully";
            res.redirect('/product/retrieve_product');
        })
        .catch(err => console.log(err))
});


router.get('/retrieve_product', (req, res) => {
    Product.findAll({
        // where: {
        // 	id: req.id
        // },
        order: [
            ['id', 'ASC']
        ],
        raw: true
    })
        .then((products) => {
            res.render('product/retrieve_product', {
                products: products,
                admin:true
            });
        })
        .catch(err => console.log(err));
});

router.get('/showProduct', (req, res) => {
    Product.findAll({
        // where: {
        // 	id: req.id
        // },
        order: [
            ['id', 'ASC']
        ],
        raw: true
    })
        .then((products) => {
            res.render('product/product', {
                products: products
            });
        })
        .catch(err => console.log(err));
});



// router.post('/update_product', (req, res) => {
//     let name = req.body.name;
//     let productid = req.body.id;
//     let price = req.body.price;
//     let manufacturer = req.body.manufacturer;
//     let description = req.body.description;
//     let dateRelease = moment(req.body.dateRelease, "DD/MM/YYYY").format();

//     Product.update({
//         name,
//         productid,
//         price,
//         manufacturer,
//         description,
//         dateRelease
//     }, {
//         where: {
//             id: req.params.id
//         }
//     }) 
//     .then((product) => {
//         let success_msg = "Product details submitted successfully";
//         res.redirect('/retrieve_product');
//         })
//         .catch(err => console.log(err))
// });

// Save edited video
router.post('/update_product/:id', (req, res) => {
	let name = req.body.name;
    let category = req.body.category
    let productid = req.body.id;
    let price = req.body.price;
    let manufacturer = req.body.manufacturer;
    let description = req.body.description;
    let imageURL = req.body.imageURL;
	/* console.log(`\n++++++++ Video from session: ${req.session.video.title}`);
	 console.log(`\n++++++++ All videos from session: ${req.session.allVideos}`); */
	// console.log(`URL: ${posterURL}`);
	Product.update({
        name,
        category,
        productid,
        price,
        manufacturer,
        description,
        imageURL
	}, {
		where: {
			id: req.params.id
		}
	}).then(product => {
		console.log(product)
		res.redirect('/product/retrieve_product'); // redirect to call router.get(/listVideos...) to retrieve all updated
			// videos
	}).catch(err => console.log(err));
});


router.get('/update_product/:id', (req, res) => {
    Product.findOne({where: {id: req.params.id}})
    .then(product => {
        if(product){   
            res.render("product/update_product", {product})
        }
    })
})




router.get('/delete/:id', (req, res) => {
    let productId = req.params.id;

    // Select * from videos where videos.id=videoID and videos.userId=userID
    Product.findOne({
        attributes: ['id']
    }).then((product) => {
        // if record is found, user is owner of video
        if (product != null) {
            Product.destroy({
                where: {
                    id: productId
                }
            }).then(() => {
                res.redirect('/product/retrieve_product'); // To retrieve all videos again
            }).catch(err => console.log(err));
        }
    });
});


router.post('/upload', (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/product')) {
        fs.mkdirSync('./public/uploads/product');
    }
    upload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/no-image.jpg', err: err });
        } else {
            if (req.file === undefined) {
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                res.json({ file: `/uploads/product/${req.file.filename}` });
            }
        }
    });
})

module.exports = router;