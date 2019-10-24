
const graphql = require('graphql');
const resolvers = require('./resolvers');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorName } = require('../error/errorUtils');
const { dateToString } = require('../utils/dateUtils');
const { UserResolverQuery , UserResolverMutation } = require('../src/resolvers/userResolver');
const { PostResolverMutation , PostResolverQuery } = require('../src/resolvers/postResolver');
const { fileResolverMutation } = require('../src/resolvers/uploadFile');

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
              ...fileResolverMutation,
       }
});

module.exports = new GraphQLSchema({
       query: RootQuery,
       mutation: Mutation
});

