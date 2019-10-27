var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
    // user comment
    user_id: {  
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    file_name: {
        type: String,
        required: true
    },
    type_name: {
        type: String,
        required: false
    },
    upload_at: {
        type: Date,
        required: true
    },
    media_type: {
        type: String,
        required: true  
    },
    metadata:{
        type: String,
        required: false
    },
    extension:{
        type: String,
        required: false
    },
    path:{
        type: String,
        required: false
    },
    size:{
        type: String,
        required: false
    }
});

module.exports = mongoose.model('files', fileSchema);