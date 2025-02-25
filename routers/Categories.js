
const express = require('express');
const Router=express.Router();
const Category=require('../models/category');




Router.get('/', async (req, res) => {
    try {
        const Categories = await Category.find(); 
        if (Categories.length === 0) {
            return res.status(404).json({ success: false, message: "No categories found" });
        }
        res.status(200).send(Categories);
    } catch (error) {
        res.status(500).json({ message: 'Error in getting Categories', error });
    }
});



Router.get('/:id', async (req, res) => {
    try {
        const Categories = await Category.findById(req.params.id); 
        if (!Categories) {
            return res.status(500).json({  message: "No categories found with this ID" });
        }
        res.status(200).send(Categories);
    } catch (error) {
        res.status(500).json({ message: 'Error in getting Categories', error });
    }
});



Router.put('/:id', async (req, res) => {
   
        const Categories = await Category.findByIdAndUpdate(
            req.params.id,{

                name:req.body.name

            },
            {new:true}
        
        ); 
        if (!Categories) {
            return res.status(400).send({  message: "the category can not be created" });
        }
        res.status(200).send(Categories);
   
});


Router.post('/', async (req, res) => {
    let category=new Category({
        name:req.body.name
    })
    category=await category.save();
    if(!category)
        return res.status(404).send("the category cannot be created")
    res.send(category);
});



Router.delete('/:id', async (req, res) => {
    Category.findByIdAndDelete(req.params.id).then(category=>{
        if(category){
            return res.status(200).json({success:true,message:"the category is deleted"})
        }else{
            return res.status(404).json({success:false,message:"the category is not found"})
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err})
    })
});



module.exports=Router;