const jwt = require('jsonwebtoken');
const graphql = require('graphql');
const Posts = require('../../models/posts');
const Like = require('../../models/like');
const Comments = require('../../models/comment');
const { dateToString, currentDate } = require('../../utils/dateUtils');
const { errorName } = require('../../error/errorUtils');
const { config } = require('../../utils/config');

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLInputObjectType
} = graphql;


const checkAccessToken = access_token => {
    if (!access_token) {
        return false;
    } else {
        if (!access_token || access_token === '') {
            return false;
        }
        let decodedToken = jwt.verify(access_token, process.env.SECRET_KEY);
        // if (!decodedToken) {
        //     return false;
        // }
        // return true;
        return decodedToken;
    }
}


module.exports.PostResolverQuery = {

}
const listPostsType = new GraphQLList(
    new GraphQLObjectType({
        name: 'Posts',
        fields: () => ({
            _id: { type: GraphQLID },
            post_date: { type: GraphQLString },
            post_content: { type: GraphQLString },
            post_status: { type: GraphQLString },
            post_type: { type: GraphQLString },
            post_like_count: { type: GraphQLInt },
            post_comment_count: { type: GraphQLInt },
            post_has_article: { type: GraphQLInt },
            article_title: { type: GraphQLString },
            article_content: { type: GraphQLString },
            creator: { type: GraphQLID },
        })
    }));

module.exports.PostResolverMutation = {
    createPosts: {
        type: listPostsType,
        description: "Tạo danh sách bài viết mới",
        args: {
            input: {
                type: new GraphQLList(
                    new GraphQLInputObjectType({
                        name: 'PostsInput',
                        fields: () => ({
                            post_title: { type: GraphQLString },
                            post_content: { type: GraphQLString },
                            post_status: { type: GraphQLString },
                            post_type: { type: GraphQLString },
                            post_has_article: { type: GraphQLInt },
                            article_title: { type: GraphQLString },
                            article_content: { type: GraphQLString },
                            creator: { type: GraphQLID },
                        })
                    }))
            }
        },
        resolve: async (parent, { input }, context) => {
            try {
                return await Promise.all(
                    input.map(post => {
                        const posts = new Posts({
                            post_date: currentDate,
                            post_content: post.post_content,
                            post_title: post.post_title,
                            post_status: !post.post_status ? "0" : "1",
                            post_type: post.post_type,
                            post_has_article: 0,
                            article_title: "",
                            article_content: "",
                            post_like_count: 0,
                            post_comment_count: 0,
                            creator: post.creator,
                        });
                        if (post.post_has_article == 1) {
                            posts.post_has_article = post.post_has_article;
                            posts.article_title = post.article_title;
                            posts.article_content = post.article_content;
                        }
                        return posts.save();
                    })
                ).then(listPost => {
                    return listPost;
                }).catch(err => {
                    throw new Error(errorName.POST_CREATE_ERROR);
                });
            } catch (err) {
                throw err;
            }

        }

    },
    comment: {
        type: new GraphQLObjectType({
            name: "CommentPost",
            fields: () => ({
                id: { type: GraphQLID },
                posts_id: { type: GraphQLID },
                user_id: { type: GraphQLID },
                comment_at: { type: GraphQLString },
            }),
        }),
        args: {
            access_token: { type: GraphQLString },
            input: {
                type: new GraphQLInputObjectType({
                    name: "CommentInput",
                    fields: () => ({
                        posts_id: { type: new GraphQLNonNull(GraphQLID) },
                        comment_content: { type: new GraphQLNonNull(GraphQLString) },
                        comment_type: { type: GraphQLString },
                        comment_at: { type: GraphQLString },
                        comment_type: { type: GraphQLInt },
                    })
                })
            }
        },
        description: "Comment bài viết truyền vào vs id bài viết",
        resolve: async (parent, { input, access_token }, context) => {
            try {
                if (!access_token || access_token === '') {
                    if (!context.req.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null) {
                    const post = await Posts.findById(input.posts_id);
                    if (!post) {
                        throw new Error(errorName.POST_NOT_FOUND_BY_ID);
                    } else {
                        // update post count 
                        const commentCount = parseInt(post.post_comment_count) + 1;
                        post.post_comment_count = commentCount;
                        const postUpdate = await post.save();
                        const comment = new Comments({
                            user_id: userInfo.userId,
                            comment_content: input.comment_content,
                            comment_type: config.COMMENT_TYPE_POST,
                            comment_at: currentDate,
                            comment_is_edit: false,
                            posts_id: post._id.toString(),
                        });
                        const result = await comment.save();
                        return {
                            id: result._id.toString(),
                            posts_id: post._id,
                            user_id: result.user_id,
                            comment_content: input.comment_content,
                            comment_type: result.comment_type,
                            comment_at: result.comment_at,
                        }
                    }
                } else {
                    throw new Error(errorName.UNAUTHORIZED);
                }
            } catch (err) {
                throw err;
            }
            return {};
        }
    },
    likePost: {
        type: new GraphQLObjectType({
            name: "LikePost",
            fields: () => ({
                id: { type: GraphQLID },
                posts_id: { type: GraphQLID },
                user_id: { type: GraphQLID },
                like_type: { type: GraphQLInt },
                like_status: { type: GraphQLBoolean },
            }),
        }),
        args: {
            access_token: { type: GraphQLString },
            input: {
                type: new GraphQLInputObjectType({
                    name: "LiketInput",
                    fields: () => ({
                        posts_id: { type: new GraphQLNonNull(GraphQLID) },
                        like_type: { type: new GraphQLNonNull(GraphQLInt) },
                        like_status: { type: new GraphQLNonNull(GraphQLBoolean) },
                    })
                })
            }
        },
        description: "like bài viết truyền vào vs id bài viết với like_status = true like false unlike",
        resolve: async (parent, { input, access_token }, context) => {
            try {
                if (!access_token || access_token === '') {
                    if (!context.req.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null) {
                    const post = await Posts.findById(input.posts_id);
                    if (!post) {
                        throw new Error(errorName.POST_NOT_FOUND_BY_ID);
                    } else {
                        // update post count like
                        const likeCount = input.like_status ? parseInt(post.post_like_count) + 1
                            : parseInt(post.post_like_count) - 1;
                        post.post_like_count = likeCount;
                        const postUpdate = await post.save();

                        const like = new Like({
                            user_id: userInfo.userId,
                            like_at: currentDate,
                            like_change_at: currentDate,
                            like_type: input.like_type,
                            like_status: input.like_status,
                            posts_id: post._id.toString(),
                        });
                        const result = await like.save();
                        return {
                            id: result._id.toString(),
                            posts_id: post._id,
                            user_id: result.user_id,
                            like_type: result.like_type,
                            like_status: result.like_status,
                        }
                    }
                } else {
                    throw new Error(errorName.UNAUTHORIZED);
                }
            } catch (err) {
                throw err;
            }
            return null;
        }
    },
    deleteComment: {
        type: new GraphQLObjectType({
            name: "DeleteComment",
            fields: () => ({
                status: { type: GraphQLBoolean },
                comment_id: { type: GraphQLID },
                message: { type: GraphQLString },
            }),
        }),
        args: {
            access_token: { type: GraphQLString },
            comment_id: { type: new GraphQLNonNull(GraphQLID) }
        },
        description: "delete comment",
        resolve: async (parent, { comment_id, access_token }, context) => {
            try {
                if (!access_token || access_token === '') {
                    if (!context.req.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null) {
                    const comment = await Comments.findById({ _id: comment_id });
                    const deleteResult = await Comments.deleteOne({ _id: comment_id });
                    const result = {
                        status: true,
                        message: "delete completed",
                        comment_id: comment_id
                    };
                    if (deleteResult.deletedCount === 1) {
                        const post = await Posts.findById(comment.posts_id);
                        const commentCount = parseInt(post.post_comment_count) - 1;
                        post.post_like_count = commentCount;
                        const postUpdate = await post.save();
                        return result;
                    } else {
                        result.status = false;
                        result.message = "delete failed or not found by id " + comment_id;
                        return result;
                    }

                } else {
                    throw new Error(errorName.UNAUTHORIZED);
                }
            } catch (err) {
                throw err;
            }
        }
    },
    // todo
    searchPost: {
        type: listPostsType,
        args: {
            access_token: { type: GraphQLString },
            search: { type: GraphQLString },
        },
        description: "search post by title or content",
        resolve: async (parent, { search, access_token }, context) => {
            try {
                if (!access_token || access_token === '') {
                    if (!context.req.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null) {
                    return
                } else {
                    throw new Error(errorName.UNAUTHORIZED);
                }
            } catch (err) {
                throw err;
            }
        }
    }
}