
const graphql = require('graphql');
const { UserResolverQuery , UserResolverMutation } = require('../src/resolvers/userResolver');
const { PostResolverMutation , PostResolverQuery } = require('../src/resolvers/postResolver');
const { FileResolverQuery , FileResolverMutation } = require('../src/resolvers/fileResolver');
// const { fileResolverMutation } = require('../src/resolvers/uploadFile');


const {
       GraphQLObjectType, GraphQLString,
       GraphQLID, GraphQLInt, GraphQLSchema,
       GraphQLList, GraphQLNonNull,
       GraphQLFloat,
       GraphQLInputObjectType
} = graphql;

const RootQuery = new GraphQLObjectType({
       name: 'Query',
       fields: {
              ...UserResolverQuery,
              ...PostResolverQuery,
              ...FileResolverQuery,
       }
});

const Mutation = new GraphQLObjectType({
       name: 'Mutation',
       fields: {
              // test: {
              //        type: GraphQLString,
              //        resolve: async (parent, { input }) => {
              //               return "test";
              //        }
              // }
              ...UserResolverMutation,
              ...PostResolverMutation,
              // ...fileResolverMutation,
              ...FileResolverMutation,
       }
});

module.exports = new GraphQLSchema({
       query: RootQuery,
       mutation: Mutation
});

