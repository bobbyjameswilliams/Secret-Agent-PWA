var express = require('express');
var router = express.Router();

var card = require('../controllers/cards');
var initDB = require('../controllers/init');
initDB.init();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});

module.exports = router;
