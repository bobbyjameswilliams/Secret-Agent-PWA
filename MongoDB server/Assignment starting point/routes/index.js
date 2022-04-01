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
    .get('/getArticle', function (req, res) {
        console.log("/getArticle get Called.");
        article.getArticle;
    })
    .post('/getArticle', article.getArticle);

router
    .get('/getArticles', function (req, res) {
        console.log("/getArticles get Called.");
        article.getAllArticles;
    })
    .post('/getArticles', article.getAllArticles);

router
    .get('/insertArticle', function (req, res) {
        console.log("/insertArticle get Called.");
        article.insertArticle;
    })
    .post('/insertArticle', article.insertArticle);

module.exports = router;
