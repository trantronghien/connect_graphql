
const graphql = require('graphql');
const resolvers = require('./resolvers');
// const user = require('./resolvers');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

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
              User: {
                     type: UserType,
                     args: { id: { type: GraphQLID } },
                     // resolve: resolvers.user
                     resolve(parent, args) {
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
              // addAuthor: {
              //        type: GraphQLString,
              // args: {
              //     //GraphQLNonNull make these field required
              //     name: { type: new GraphQLNonNull(GraphQLString) },
              //     age: { type: new GraphQLNonNull(GraphQLInt) }
              // },
              // resolve(parent, args) {
              //     let author = new Author({
              //         name: args.name,
              //         age: args.age
              //     });
              //     return author.save();
              //               return "Mutation";
              //        }
              // }
       }
});

module.exports = new GraphQLSchema({
       query: RootQuery,
       mutation: Mutation
});

