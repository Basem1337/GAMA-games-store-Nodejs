const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Router = express.Router();
const Product = require('../models/Game');
const Category = require('../models/category');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images is allowed'), false);
    }
};


const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: fileFilter
});


Router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// GET game by id
Router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ success: false, message: "No game found with this ID" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving game', error });
    }
});

// // POST  game

// Router.post('/', upload.single('gamePoster'), async (req, res) => {
//     try {
//         let categoryId = req.body.category;

//         if (!categoryId) {
//             const defaultCategory = await Category.findOne({ name: "Default" });
//             if (!defaultCategory) {
//                 const newCategory = new Category({ name: "Default" });
//                 const savedCategory = await newCategory.save();
//                 categoryId = savedCategory._id;
//             } else {
//                 categoryId = defaultCategory._id;
//             }
//         }

//         let newGame = new Product({
//             gamePoster: req.file ? req.file.path : null, // Save file path if uploaded
//             gameName: req.body.gameName,
//             company: req.body.company,
//             category: categoryId,
//             description: req.body.description,
//             price: req.body.price,
//             originalPrice: req.body.originalPrice ? req.body.originalPrice : req.body.price,
//             rating: req.body.rating || 0,
//             trailer: req.body.trailer
//         });

//         newGame = await newGame.save();

//         if (!newGame) {
//             return res.status(500).json({ success: false, message: 'The game could not be created' });
//         }

//         res.status(201).json(newGame);
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error creating game', error });
//     }
// });




Router.post('/', upload.single('gamePoster'), async (req, res) => {
    try {
        console.log("Uploaded file:", req.file); 
        console.log("Request body:", req.body); 

        if (!req.file) {
            return res.status(400).json({ success: false, message: "gamePoster is required. Please upload an image." });
        }

        let categoryId = req.body.category ? req.body.category.trim().replace(/^"|"$/g, '') : null;

        if (!categoryId) {
            return res.status(400).json({ success: false, message: "Category is required. Please select a category." });
        }

       
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ success: false, message: "Invalid category id" });
        }

       
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(400).json({ success: false, message: "Category does not exist. Please select a valid category." });
        }

       
        const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

        const newGame = new Product({
            gamePoster: imageUrl, 
            gameName: req.body.gameName,
            company: req.body.company,
            category: categoryId,  
            description: req.body.description,
            price: req.body.price,
            originalPrice: req.body.originalPrice ? req.body.originalPrice : req.body.price,
            rating: req.body.rating || 0,
            trailer: req.body.trailer
        });

        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (error) {
        console.error("Error saving game:", error);
        res.status(500).json({ success: false, message: 'Error creating game', error });
    }
});


// PUT update game 
Router.put('/:id', upload.single('gamePoster'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid product ID');
    }

    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const updateData = {
        gameName: req.body.gameName,
        company: req.body.company,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        originalPrice: req.body.originalPrice ? req.body.originalPrice : req.body.price,
        rating: req.body.rating || 0,
        trailer: req.body.trailer
    };

    
    if (req.file) {
        updateData.gamePoster = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!product) {
        return res.status(404).json({ message: "The game was not found" });
    }

    res.status(200).json(product);
});

// DELETE game
Router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) {
            return res.status(200).json({ success: true, message: "The game has been deleted" });
        } else {
            return res.status(404).json({ success: false, message: "The game was not found" });
        }
    } catch (err) {
        return res.status(400).json({ success: false, error: err });
    }
});


Router.get('/filter', async (req, res) => {
    try {
        let filter = {};
        if (req.query.category) {
            const categoryIds = req.query.category.split(',');
            filter = { category: { $in: categoryIds } };
        }

        const products = await Product.find(filter).populate('category');

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found for the given category" });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

module.exports = Router;
