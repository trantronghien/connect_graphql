var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var likeSchema = new Schema({
    // user comment
    user_id: {  
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    like_type: {
        type: Number,
        required: false
    },
    // lúc nhấn like
    like_at: {
        type: Date,
        required: false
    },
    // lúc nhấn like or unlike
    like_change_at: {
        type: Date,
        required: false
    },
    // like or unlike
    like_status: {
        type: Boolean,
        required: false
    },
    // bài viết comment
    posts_id: {
        type: Schema.Types.ObjectId,
        ref: 'Posts'
    },

});

module.exports = mongoose.model('Like', likeSchema);