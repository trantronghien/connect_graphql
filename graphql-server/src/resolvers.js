const mongoose = require('mongoose');
const Event = require('../models/event');
const User = require('../models/user');


const user = async userId => {
    try {
      const user = await User.findById(userId);
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents)
      };
    } catch (err) {
      throw err;
    }
  };

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event._doc._id.toString(),
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch (err) {
            throw err;
        }
    },
    // user: () => {
    //     const user = new User({
    //         email: "trantronghien@gmail.com",
    //         password: "123424"
    //     });
    //     return user._doc;
    //     // return ne{ email: "trantronghien@gmail.com" , password:"123424" };
    // },
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
    },

    registerUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            const result = await user.save();

            return { ...result._doc , _id: result.id };
        } catch (error) {
            throw error;
        }
    }
}