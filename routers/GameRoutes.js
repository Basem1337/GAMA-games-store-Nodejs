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
        cb(new Error('Only images are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: fileFilter
});

// GET all games
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

// POST game
Router.post('/', upload.single('gamePoster'), async (req, res) => {
    try {
        console.log("Uploaded file:", req.file); 
        console.log("Request body:", req.body); 

        if (!req.file) {
            return res.status(400).json({ success: false, message: "gamePoster is required. Please upload an image." });
        }

        let categoryId = req.body.category ? req.body.category.trim().replace(/^"|"$/g, '') : null;
        let trailerUrl = req.body.trailer ? req.body.trailer.trim().replace(/^"|"$/g, '') : null;

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
            trailer: req.body.trailer,
            releaseYear: req.body.releaseYear, 
            discount: req.body.discount || 0   
        });


        console.log(req.trailer);
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (error) {
        console.error("Error saving game:", error);
        res.status(500).json({ success: false, message: 'Error creating game', error });
    }
    console.log("Trailer received:", req.body.trailer);

});

// update game 
Router.put('/:id', upload.single('gamePoster'), async (req, res) => {
    const { id } = req.params;
    const { category } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid game ID format" });
    }
    
    if (!mongoose.isValidObjectId(category)) {
        return res.status(400).json({ message: "Invalid category ID format" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        return res.status(400).json({ message: "Category does not exist" });
    }

    const updateData = {
        gameName: req.body.gameName,
        company: req.body.company,
        category,
        description: req.body.description,
        price: req.body.price,
        originalPrice: req.body.originalPrice || req.body.price,
        rating: req.body.rating || 0,
        trailer: req.body.trailer,
        releaseYear: req.body.releaseYear, 
        discount: req.body.discount || 0 
    };

    if (req.file) {
        updateData.gamePoster = req.file.path;
    }

    try {
        const updatedGame = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedGame) {
            return res.status(404).json({ message: "Game not found" });
        }

        res.status(200).json(updatedGame);
    } catch (error) {
        res.status(500).json({ message: "Error updating game", error: error.message });
    }
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

// filter by category 
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
