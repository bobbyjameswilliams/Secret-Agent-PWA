const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Card = new Schema(
    {
        Title: {type: String, required: true, max: 100},
        file_path: {type: String, required: true, max: 100},
        description: {type: String, required: true, max: 100},
        author_name: {type: String, required: true, max: 100},
        date_of_issue: {type: Date, required: true},
    }
);

Card.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model('Card', Card);