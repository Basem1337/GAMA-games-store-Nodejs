const Cart = require("../models/cart")
const Library = require("../models/library")

async function checkout(req,res,next){
    const userId = req.userId

    const cart = await Cart.findOne({user:userId})

    if(!cart){
        return res.status(404).json("cart not found")
    }
    
    let library = await Library.findOne({user:userId})
    
    if(!library){
        library = await Library.create({
            user: userId,
        })
    }

    library.games.push(...cart.items)

    cart.items= []

    await cart.save()
    await library.save()

    res.json("success")
}

module.exports = {checkout}