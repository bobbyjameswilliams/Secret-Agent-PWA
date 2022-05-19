var express = require('express');
var router = express.Router();

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
    .post('/getArticles', article.getAllArticles);

router
    .post('/insertArticle', article.insert);

module.exports = router;
