const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: {type:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      ],default:[]},
})

const Cart = mongoose.model("Cart",cartSchema)

module.exports = Cart