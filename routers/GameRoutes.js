const express = require('express');
const Router=express.Router();
const Product=require('../models/Game');
const Cateegory=require('../models/category');
const { default: mongoose } = require('mongoose');




  

Router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category'); 
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});




Router.get('/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('category'); 
        if (!product) {
            return res.status(500).json({success:false,  message: "No Game found with this ID" });
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).json({ message: 'Error in getting games', error });
    }
});



Router.post('/', async (req, res) => {
    try {
        let categoryId = req.body.category;

        if (!categoryId) {
            const defaultCategory = await Category.findOne({ name: "Default" });

            if (!defaultCategory) {
                const newCategory = new Category({ name: "Default" });
                const savedCategory = await newCategory.save();
                categoryId = savedCategory._id;
            } else {
                categoryId = defaultCategory._id;
            }
        }

        let newGame = new Product({
            gamePoster: req.body.gamePoster,
            gameName: req.body.gameName,
            company: req.body.company,
            category: categoryId,
            description: req.body.description,
            price: req.body.price,
            rating: req.body.rating || 0,
            trailer: req.body.trailer
        });

        newGame = await newGame.save();

        if (!newGame) {
            return res.status(500).json({ success: false, message: 'The game could not be created' });
        }

        res.status(201).json(newGame);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating game', error });
    }
});





Router.put('/:id', async (req, res) => {
    if(mongoose.isValidObjectId(res.params.id)){
        res.status(400).send('invalid product ID')
    }
    const categoryExists = await Cateegory.findById(req.body.category);

    if (!categoryExists) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

        const product = await Product.findByIdAndUpdate(
            req.params.id,{

                gamePoster: req.body.gamePoster,
                gameName: req.body.gameName,
                company: req.body.company,
                category: req.body.category, 
                description: req.body.description,
                price: req.body.price,
                rating: req.body.rating || 0, 
                trailer: req.body.trailer

            },
            {new:true}
        
        ); 
        if (!product) {
            return res.status(400).send({  message: "the product can not be created" });
        }
        res.status(200).send(product);
   
});

Router.delete('/:id', async (req, res) => {
    Product.findByIdAndDelete(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success:true,message:"the Game is deleted"})
        }else{
            return res.status(404).json({success:false,message:"the Game is not found"})
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err})
    })
});


//api for filter products by category
// /products?category=
// Router.get('/', async (req, res) => {
//     try {
//         let filter = {}; // Default filter

//         if (req.query.category) {
//             const categoryIds = req.query.category.split(',');
//             filter = { category: { $in: categoryIds } };
//         }

//         const products = await Product.find(filter).populate('category');

//         if (products.length === 0) {
//             return res.status(404).json({ success: false, message: "No products found for the given category" });
//         }

//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching products', error });
//     }
// });

/////////////
// Router.get('/', async (req, res) => {
//     try {
//         let filter={};
//         if(req.query.category){
//              filter={category:req.query.category.split(',')}
//         }
//         const products = await Product.find({category:filter}).populate('category');
//          if(!products){
//             res.status(500).json({success:false});

//          }
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching products', error });
//     }
// });

module.exports=Router;