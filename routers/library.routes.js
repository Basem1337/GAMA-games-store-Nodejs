const router = require("express").Router()
const isAuthenticated = require("../middleware/isAuthenticated")
const libraryController = require("../controllers/library.controllers")

router.route("/").get(isAuthenticated,libraryController.getLibrary)

module.exports = router