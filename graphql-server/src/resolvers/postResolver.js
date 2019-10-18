const jwt = require('jsonwebtoken');
const graphql = require('graphql');
const Posts = require('../../models/posts');
const { dateToString } = require('../../utils/dateUtils');
const { errorName } = require('../../error/errorUtils');

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat,
    GraphQLInputObjectType
} = graphql;


module.exports.PostResolverQuery = {

}


module.exports.PostResolverMutation = {
    createPosts: {
        type: new GraphQLObjectType({
            name: 'Posts',
            fields: () => ({
                _id: { type: GraphQLID },
                post_date: { type: GraphQLString },
                post_content: { type: GraphQLString },
                post_status: { type: GraphQLString },
                post_type: { type: GraphQLString },
                post_like_count: { type: GraphQLString },
                post_comment_count: { type: GraphQLInt },
                post_has_article: { type: GraphQLInt },
                article_title: { type: GraphQLString },
                article_content: { type: GraphQLString },
                creator: { type: GraphQLID },
            })
        }),
        description: "Tạo danh sách bài viết mới",
        args: {
            input: {
                type: new GraphQLList(
                    new GraphQLInputObjectType({
                        name: 'PostsInput',
                        fields: () => ({
                            post_date: { type: GraphQLString },
                            post_content: { type: GraphQLString },
                            post_status: { type: GraphQLString },
                            post_type: { type: GraphQLString },
                            post_like_count: { type: GraphQLString },
                            post_comment_count: { type: GraphQLInt },
                            post_has_article: { type: GraphQLInt },
                            article_title: { type: GraphQLString },
                            article_content: { type: GraphQLString },
                            creator: { type: GraphQLID },
                        })
                    }))
            }
        },
        resolve: async (parent, { input }) => {
            const posts = new Posts({
                post_date: input.post_date,
                post_content: input.post_content,
                post_status: input.post_status,
                post_type: input.post_type,
                post_like_count: input.post_like_count,
                post_comment_count: input.post_comment_count,
                post_has_article: input.post_has_article,
                article_title: input.article_title,
                article_content: input.article_content,
                creator: input.creator,
            });
            const result = await posts.save();
            return result._doc;
        }

    },
}