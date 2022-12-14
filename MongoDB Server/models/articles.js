const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Article schema for mongoDB
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, any, any>}
 */
const Article = new Schema(
    {
        title: {type: String, required: true, max: 100},
        image: {type: String},
        description: {type: String, max: 100},
        author_name: {type: String, max: 100},
        date_of_issue: {type: Number},
    }
);

Article.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model('Article', Article);