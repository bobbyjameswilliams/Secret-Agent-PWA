const mongoose = require('mongoose');
const Card = require('../models/cards');


exports.init= function() {
    // uncomment if you need to drop the database

    //Character.remove({}, function(err) {
    //   console.log('collection removed')
    //});

    const title = "Test card";

    let card = new Card({
        Title: title,
        file_path: "../test.jpg",
        description: "Test",
        author_name: "Dan W",
        date_of_issue: Date.now(),
    });
    // console.log('dob: '+character.dob);

    card.save()
        .then ((results) => {
            console.log("object created in init: "+ JSON.stringify(results));
        })
        .catch ((error) => {
            console.log(JSON.stringify(error));
        });
}
