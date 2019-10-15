
const graphql = require('graphql');
const resolvers = require('./resolvers');
// const user = require('./resolvers');
const User = require('../models/user');

const {
       GraphQLObjectType, GraphQLString,
       GraphQLID, GraphQLInt, GraphQLSchema,
       GraphQLList, GraphQLNonNull,
       GraphQLFloat
} = graphql;

const UserType = new GraphQLObjectType({
       name: 'User',
       fields: () => ({
              _id: { type: GraphQLID },
              email: { type: GraphQLString },
              created: { type: GraphQLString }
              //  creator: User!
       })
});

const UserInput = new GraphQLObjectType({
       name: 'UserInput',
       fields: () => ({
              _id: { type: GraphQLID },
              email: { type: GraphQLString },
              password: { type: GraphQLString },
              permission: { type: GraphQLFloat },
              created: { type: GraphQLString }
              //  creator: User!
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

const Mutation = new GraphQLObjectType({
       name: 'Mutation',
       fields: {
              addAuthor: {
                     type: GraphQLString,
                     // args: {
                     //     //GraphQLNonNull make these field required
                     //     name: { type: new GraphQLNonNull(GraphQLString) },
                     //     age: { type: new GraphQLNonNull(GraphQLInt) }
                     // },
                     resolve(parent, args) {
                            //     let author = new Author({
                            //         name: args.name,
                            //         age: args.age
                            //     });
                            //     return author.save();
                            return "Mutation";
                     }
              }
       }
});

module.exports = new GraphQLSchema({
       query: RootQuery,
       mutation: Mutation
});

