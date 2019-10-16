var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    post_date: {
        type: Date,
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
        required: true
    },
    post_comment_count: {
        type: Number,
        required: true
    },
    post_has_article: {
        type: Number,
        required: true
    },
    article_title: {
        type: String,
        required: true
    },
    article_content: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

