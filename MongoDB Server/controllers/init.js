const mongoose = require('mongoose');
const Article = require('../models/articles');


exports.init= function() {
    // uncomment if you need to drop the database

    // Article.remove({}, function(err) {
    //    console.log('collection removed')
    // });

    // let article = new Article({
    //     title: "Test article",
    // });
    // // console.log('dob: '+character.dob);
    //
    //
    // article.save()
    //     .then ((results) => {
    //         console.log("article created in init: "+ JSON.stringify(results));
    //     })
    //     .catch ((error) => {
    //         console.log(JSON.stringify(error));
    //     });
}
