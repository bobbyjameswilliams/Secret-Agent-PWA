var express = require('express');
var router = express.Router();

var card = require('../controllers/cards');
var article = require('../controllers/articles');
var initDB = require('../controllers/init');
initDB.init();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('MongoDB Server');
});


router
    .post('/getArticle', article.getArticle);
router
    .post('/getArticles', article.getArticles);

module.exports = router;
