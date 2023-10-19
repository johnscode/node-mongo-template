var express = require('express');
var authController = require("../controllers/authController")
var router = express.Router();

// base path is /auth
router.get('/',authController.loginFormController)
router.post('/',authController.loginPostController)

module.exports = router;