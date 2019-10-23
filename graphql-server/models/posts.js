var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    post_date: {
        type: Date,
        required: true
    },
    post_title:{
        type: String,
        required: true
    },
    post_content: {
        type: String,
        required: true
    },
    post_status: {
        type: String,
        required: true
    },
    post_type: {
        type: String,
        required: true
    },
    post_like_count: {
        type: String,
        required: false
    },
    post_comment_count: {
        type: Number,
        required: false
    },
    post_has_article: {
        type: Number,
        required: false
    },
    article_title: {
        type: String,
        required: false
    },
    article_content: {
        type: String,
        required: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}); 

// support full-text search 
postSchema.index({post_title: 'text', post_content: 'text' , 
article_title: 'text' , article_content: 'text'});
module.exports = mongoose.model('Posts', postSchema);