const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
var os = require('os');
var ifaces = os.networkInterfaces();

// const schema = require('./src/Schema');
const schema = require('./src/schema_root');
const resolvers = require('./src/resolvers');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isAuth = require('./middleware/auth')

const app = express();

app.use(bodyParser.json());
// using middleware
app.use(isAuth);

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

// app.get('/',(req , res , next) =>{
//     res.send("hello ");
// });

// const connectString = `mongodb+srv://user_1:Abc123456789@cluster0-gi2y8.gcp.mongodb.net/event-react?retryWrites=true&w=majority`
const connectString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-gi2y8.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

// console.log(`string connect:  ${connectString}`);

mongoose.connect(connectString).then(() => {
    console.log("connected monogo db");
}).catch(err => {
    console.error("can't connect mongo db");
});

app.listen(3000, () =>{
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
      
        ifaces[ifname].forEach(function (iface) {
          if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
          }
      
          if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, iface.address);
          } else {
            // this interface has only one ipv4 adress
            console.log(ifname, iface.address);
          }
          ++alias;
        });
      });
});

