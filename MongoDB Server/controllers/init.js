const mongoose = require('mongoose');
const Article = require('../models/articles');


exports.init= function() {
    // uncomment if you need to drop the database

    //Article.remove({}, function(err) {
    //    console.log('collection removed')
    //});
}
