const mongoose=require('mongoose');


const productSchema = new mongoose.Schema({

    gamePoster:
     { 
      type: String,
    //   required: true 
      
    }, 
    gameName: 
    {
     type: String, 
     required: true 
    },
    company:
     { 
        type: String,
         required: true 
     },
    category: {
         type: mongoose.Schema.Types.ObjectId,
         ref:'Category',
         required: true 
        },
    description:
     {
         type: String,
         required: true 
     },
    price: 
    { 
     type: Number,
     required: true,
     default:0 
     },
     originalPrice: { 
        type: Number, 
        default: null 
    }
     ,
    rating: 
    { 
        type: Number,
        default:0 , 
        min: 0, 
        max: 5
     },
    trailer: { 
        type: String 
    }


});

module.exports= mongoose.model('Product', productSchema);
