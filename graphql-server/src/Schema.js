// import {
//     GraphQLSchema,
//     GraphQLObjectType,
//     GraphQLID,
//     GraphQLString,
//     GraphQLNonNull,
//     GraphQLList
//   } from 'graphql';



//   const Query = new GraphQLObjectType({
//       name: "Query",
//       fields: () => ({

//       })
//   });

//   const Schema = new GraphQLSchema({
//     query: Query
//   });

const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        password: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery{
        events: [Event!]!
        user: [OutUser!]!
    }

    type OutUser {
        _id: String!
        email: String!
    }

    type RootMutation{
        createEvents(event: EventInput!) : Event

        registerUser(user: UserInput!) : User
    }


    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)

