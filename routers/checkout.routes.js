const router = require("express").Router()
const isAuthenticated = require("../middleware/isAuthenticated")
const checkouteControllers = require("../controllers/checkout.controllers")

router.route("/").post(isAuthenticated,checkouteControllers.checkout)

module.exports = router