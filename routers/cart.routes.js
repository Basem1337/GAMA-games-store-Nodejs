const router = require("express").Router()
const isAuthenticated = require("../middleware/isAuthenticated")
const cartController = require("../controllers/cart.controllers")


router.route("/").post(isAuthenticated,cartController.addToCart).get(isAuthenticated,cartController.getCart).patch(isAuthenticated,cartController.removeItemFromCart)

module.exports = router