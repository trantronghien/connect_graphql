const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');

const schema = require('./src/Schema');
const resolvers = require('./src/resolvers');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
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

