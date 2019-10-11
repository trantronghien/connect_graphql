const mongoose = require('mongoose');
const Event = require('../models/event');
const User = require('../models/user');

module.exports = {
    events: () => {
        return Event.find()
            .then(result => {
                return result.map(event => {
                    return {
                        ...event._doc,
                        _id: event._doc._id.toString()
                    };
                })
            }).catch(err => {
                throw err;
            });
    },
    user: () => {
        const user = new User({
            email: "trantronghien@gmail.com", 
            password: "123424"
        });
        return user._doc;
        // return ne{ email: "trantronghien@gmail.com" , password:"123424" };
    },
    createEvents: (args) => {
        const event = new Event({
            title: args.event.title,
            description: args.event.description,
            price: args.event.price,
            date: new Date().toISOString()
        });
        console.log(event);
        return event.save().then(result => {
            console.log(result);
            return { ...result._doc }
        }).catch(err => {
            console.log(err);
        });
    }
}