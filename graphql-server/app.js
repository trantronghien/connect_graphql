const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        type RootQuery{
            events: [Event!]!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootMutation{
            createEvents(event: EventInput!) : Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
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
    },
    graphiql: true
}));

// app.get('/',(req , res , next) =>{
//     res.send("hello ");
// });

const connectString = `mongodb+srv://user_1:Abc123456789@cluster0-gi2y8.gcp.mongodb.net/event-react?retryWrites=true&w=majority`
// const connectString = `mongodb+srv://
//     ${process.env.MONGO_USER}:
//     ${process.env.MONGO_PASSWORD}
//     @cluster0-gi2y8.gcp.mongodb.net/
//     ${process.env.MONGO_DB}
//     ?retryWrites=true&w=majority`;

console.log(connectString);

mongoose.connect(connectString).then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});

