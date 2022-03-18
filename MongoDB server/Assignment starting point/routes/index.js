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
    .get('/getArticle', function (req, res, next) {
      res.send('Get Article');
    })
    .post('/getArticle', function(req,res){article.getArticle});

router
    .get('/getArticles', function (req, res, next) {
      res.send('Get Articles');
    })
    .post('/getArticles', function(req,res){article.getArticles});

module.exports = router;
