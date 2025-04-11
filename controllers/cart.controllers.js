const Cart = require("../models/cart")
const Library = require("../models/library")

async function addToCart(req,res,next){
    const userId= req.userId
    const productId = req.body.productId

    let cart = await Cart.findOne({user:userId})
    
    if(!cart){
        cart = await Cart.create({
            user:userId,
            items: []
        })
    }

    const isFound = cart.items.includes(productId)

    if(isFound){
        return res.status(302).json("Game is already in cart.")
    }

    const library = await Library.findOne({user:userId})
    const hasGame = library?.games.includes(productId)

    if(hasGame){
        return res.status(302).json("Game is already in library.")
    }

    cart.items.push(productId)

    await cart.save()

    const updatedCart = await Cart.findOne({user:userId}).populate("items")

    res.json(updatedCart)
}

async function getCart(req,res,next){
    const userId = req.userId

    const cart = await Cart.findOne({user:userId}).populate("items")

    if(!cart){
        return res.status(404).json("cart not found")
    }

    res.json(cart)
}

async function removeItemFromCart(req,res,next){
    const userId = req.userId;
    const {productId} = req.body

    let cart = await Cart.findOne({user:userId})

    if(!cart){
        return res.status(404).json("cart not found")
    }
    
    const isFound = cart.items.includes(productId)
    
    if(!isFound){
        return res.status(404).json("product not found")
    }

    cart.items = cart.items.filter(product=>product != productId)

    await cart.save()

    cart = await Cart.findOne({user:userId}).populate("items")

    res.json(cart)
}


module.exports = {addToCart,getCart,removeItemFromCart}