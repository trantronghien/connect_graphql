var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // createEvents: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Event'
    //     }
    // ]
    permission: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        required: true
    }

});

module.exports = mongoose.model('User', userSchema);