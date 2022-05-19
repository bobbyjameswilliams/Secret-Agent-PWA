var express = require('express');
var router = express.Router();

var article = require('../controllers/articles');
var initDB = require('../controllers/init');
initDB.init();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('MongoDB Server');
});

/**
 * Route to get an article
 */
router
    .post('/getArticle', article.getArticle);

/**
 * Route to get all articles
 */
router
    .post('/getArticles', article.getAllArticles);

/**
 * Route to insert an article
 */
router
    .post('/insertArticle', article.insert);

module.exports = router;
