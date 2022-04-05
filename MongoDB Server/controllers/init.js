const mongoose = require('mongoose');
const Card = require('../models/cards');
const Article = require('../models/articles');


exports.init= function() {
    // uncomment if you need to drop the database

    //Character.remove({}, function(err) {
    //   console.log('collection removed')
    //});

    let card = new Card({
        article_id: "Test Card",
    });

    let article = new Article({
        title: "Test article",
    });
    // console.log('dob: '+character.dob);

    card.save()
        .then ((results) => {
            console.log("card created in init: "+ JSON.stringify(results));
        })
        .catch ((error) => {
            console.log(JSON.stringify(error));
        });
    article.save()
        .then ((results) => {
            console.log("article created in init: "+ JSON.stringify(results));
        })
        .catch ((error) => {
            console.log(JSON.stringify(error));
        });
}
