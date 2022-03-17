const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Card = new Schema(
    {
        article_id: {type: String, required: true},
    }
);

Card.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model('Card', Card);