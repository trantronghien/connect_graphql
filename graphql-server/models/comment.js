var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    // user comment
    user_id: {  
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comment_content: {
        type: String,
        required: true
    },
    comment_type: {
        type: Number,
        required: false
    },
    comment_at: {
        type: Date,
        required: true
    },
    comment_is_edit: {
        type: Boolean,
        required: false
    },
    // bài viết comment
    posts_id: {
        type: Schema.Types.ObjectId,
        ref: 'Posts'
    },

});

module.exports = mongoose.model('Comments', commentSchema);