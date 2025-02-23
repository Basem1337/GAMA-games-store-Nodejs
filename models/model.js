const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    GameName:{
       type:String,
       required:true 
    },
    Company:{
        type:String,
        required:true
    },
    Category:{
        type:String,
        required:true 
     },
     Description:{
         type:String,
         required:true
     },
     Price:{
        type:Number,
        required:true
     },
     Rating:{
        type:String,
        required:true
     },
     Trailer:{
        type:String,
        required:true
     },

});

module.exports  = mongoose.model('Game',gameSchema);