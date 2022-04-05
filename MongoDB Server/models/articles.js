const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Article = new Schema(
    {
        title: {type: String, required: true, max: 100},
        file_path: {type: String, max: 100},
        description: {type: String, max: 100},
        author_name: {type: String, max: 100},
        date_of_issue: {type: Date},
    }
);

Article.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model('Article', Article);