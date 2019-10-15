
const graphql = require('graphql');
const resolvers = require('./resolvers');

const {
       GraphQLObjectType, GraphQLString,
       GraphQLID, GraphQLInt, GraphQLSchema,
       GraphQLList, GraphQLNonNull,
       GraphQLFloat
} = graphql;

const EventType = new GraphQLObjectType({
       name: 'Events',
       fields: () => ({
              _id: { type: GraphQLID },
              title: { type: GraphQLString },
              description: { type: GraphQLString },
              price: { type: GraphQLFloat },
              date: { type: GraphQLString }
              //  creator: User!
       })
});
const BookType = new GraphQLObjectType({
       name: 'Book',
       fields: () => ({
              id: { type: GraphQLID },
              name: { type: GraphQLString },
              pages: { type: GraphQLInt }
       })
});

const RootQuery = new GraphQLObjectType({
       name: 'Query',
       fields: {
              events: {
                     type: EventType,
                     //        // args: { id: { type: GraphQLID } },
                     resolve(parent, args) {
                            // console.log("RootQuery");
                            // var event = {
                            //        title: "adbasmdas",
                            //        description: "adjasdka aksdlasd",
                            //        price: 19.3,
                            //        date: new Date().toISOString()
                            // }
                            return resolvers.events;
                     }
              },
              book: {
                     type: BookType,
                     resolve(parent, args) {
                            return {
                                   name: "hjads",
                                   pages: 1
                            };
                     }
              }
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

