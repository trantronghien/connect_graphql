
const graphql = require('graphql');
const resolvers = require('./resolvers');
// const user = require('./resolvers');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
       GraphQLObjectType, GraphQLString,
       GraphQLID, GraphQLInt, GraphQLSchema,
       GraphQLList, GraphQLNonNull,
       GraphQLFloat,
       GraphQLInputObjectType
} = graphql;

const UserType = new GraphQLObjectType({
       name: 'User',
       fields: () => ({
              _id: { type: GraphQLID },
              email: { type: GraphQLString },
              created: { type: GraphQLString },
              permission: { type: GraphQLString }
       })
});

const UserInput = new GraphQLInputObjectType({
       name: 'UserInput',
       fields: () => ({
              _id: { type: GraphQLID },
              email: { type: new GraphQLNonNull(GraphQLString) },
              permission: { type: GraphQLInt },
              password: { type: new GraphQLNonNull(GraphQLString) }
       })
});

const RootQuery = new GraphQLObjectType({
       name: 'Query',
       fields: {
              test: {
                     type: GraphQLString,
                     resolve(parent , args) {
                            return "abc";
                     }
              },
              User: {
                     type: UserType,
                     args: { id: { type: GraphQLID } },
                     // resolve: resolvers.user
                     // 5da6ddb16dd74e6220b3c0e1
                     resolve(parent ,args) {
                            console.log("adas");
                            
                            // console.log(req);
                            // if (!req.isAuth) {
                            //        throw new Error('Unauthenticated!');
                            // }
                            try {
                                   const user = User.findById(args.id);
                                   console.log(args.id);
                                   return user.map(usr => {
                                          return {
                                                 _id: usr._doc._id,
                                                 email: usr.email,
                                                 created: usr.created
                                          }
                                   });
                            } catch (err) {
                                   throw err;
                            }
                     }
              },
       }
});


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

const Mutation = new GraphQLObjectType({
       name: 'Mutation',
       fields: {
              registerUser: {
                     type: UserType,
                     description: "Tạo user mới",
                     args: {
                            input: { type: new GraphQLNonNull(UserInput) }
                     },
                     resolve: async (parent, { input }) => {
                            const hashedPassword = await bcrypt.hash(input.password, 12);
                            const user = new User({
                                   email: input.email,
                                   password: hashedPassword,
                                   permission: 1,
                                   created: new Date().toISOString()
                            });
                            const result = await user.save();
                            console.log(result);
                            return {
                                   _id: result._id,
                                   email: result.email,
                                   created: result.created,
                                   permission: result.permission,
                            };
                     }

              },
              login: {
                     type: new GraphQLObjectType({
                            name: "AuthData",
                            fields: () => ({
                                   userId: { type: GraphQLID },
                                   token: { type: GraphQLString },
                                   tokenExpiration: { type: GraphQLInt }
                            })
                     }),
                     description: "login account",
                     args: {
                            email: { type: new GraphQLNonNull(GraphQLString) },
                            password: { type: new GraphQLNonNull(GraphQLString) }
                     },
                     resolve: async (parent, { email, password }) => {
                            const user = await User.findOne({ email: email });
                            if (!user) {
                                   throw new Error('User does not exist!');
                            }
                            const isEqual = await bcrypt.compare(password, user.password);
                            if (!isEqual) {
                                   throw new Error('Password is incorrect!');
                            }
                            const token = jwt.sign(
                                   { userId: user.id, email: user.email },
                                   'somesupersecretkey',
                                   {
                                          expiresIn: '1h'
                                   }
                            );
                            return { userId: user.id, token: token, tokenExpiration: 1 };
                     }

              }
       }
});

module.exports = new GraphQLSchema({
       query: RootQuery,
       mutation: Mutation
});

