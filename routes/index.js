var express = require('express');
var indexController = require("../controllers/indexController")
var router = express.Router();

/* GET home page. */
router.get('/',  indexController.indexController);

module.exports = router;
