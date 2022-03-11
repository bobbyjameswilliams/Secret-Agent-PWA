var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('card', { title: 'Card View' });
});

module.exports = router;
