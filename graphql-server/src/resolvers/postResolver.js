const graphql = require('graphql');
const Posts = require('../../models/posts');
const Like = require('../../models/like');
const Comments = require('../../models/comment');
const { dateToString, currentDate } = require('../../utils/dateUtils');
const { errorName } = require('../../error/errorUtils');
const { config } = require('../../utils/config');
const stringUtil = require('../../utils/StringUtils');

const { checkAccessToken } = require('../../utils/security');

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLInputObjectType
} = graphql;

const PostType = new GraphQLObjectType({
    name: 'Posts',
    description: 'object res model post',
    fields: () => ({
        _id: { type: GraphQLID },
        post_title: { type: GraphQLString },
        post_date: { type: GraphQLString },
        post_edit_at: { type: GraphQLString },
        post_content: { type: GraphQLString },
        post_meta_title: { type: GraphQLString },
        post_meta_content: { type: GraphQLString },
        post_status: { type: GraphQLString },
        post_type: { type: GraphQLString },
        post_like_count: { type: GraphQLInt },
        post_comment_count: { type: GraphQLInt },
        post_has_article: { type: GraphQLInt },
        article_title: { type: GraphQLString },
        article_content: { type: GraphQLString },
        creator: { type: GraphQLID },
    })
})
const listPostsType = new GraphQLList(PostType);

module.exports.PostResolverQuery = {
    getPostByUser: {
        type: listPostsType,
        description: "Lấy ds bài viết theo user",
        args: {
            access_token: { type: GraphQLString }
        },
        resolve: async (parent, { access_token }, context) => {
            try {
                if (!access_token || access_token === '') {
                    if (!context.request.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    } else {
                        creator = context.request.userId;
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null || context.request.isAuth) {
                    var creator = !context.request.isAuth ? userInfo.userId : context.request.userId;
                    var result = await Posts.find({ creator: creator });
                    return result;
                } else {
                    throw new Error(errorName.UNAUTHORIZED);
                }
            } catch (err) {
                throw err;
            }
        }
    },
    getPosts: {
        type: new GraphQLObjectType({
            name: "GetPostsAllType",
            
            fields: () => ({
                count: { type: GraphQLInt },
                posts: { type: listPostsType }
            }),
        }),
        args: {
            access_token: { type: GraphQLString , description: 'có thể add trên header ko cần access_token với key Authorization: Bearer ...jwt' },
            from_date: { type: GraphQLString ,description: 'time iso format ex: 2017-09-03T02:00:00Z'},
            to_date: { type: GraphQLString , description: 'time iso format ex: 2017-09-03T02:00:00Z'},
            page: { type: GraphQLInt , description: 'number page'},
            limit: { type: GraphQLInt },
        },
        description: "get post mới nhất",
        resolve: async (parent, { access_token, page, limit , from_date , to_date }, context) => {
            try {
                if (!access_token || access_token === '') {
                    if (!context.request.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null || context.request.isAuth) {
                    var userId = !context.request.isAuth ? userInfo.userId : context.request.userId;
                    var query = {};
                    if(!from_date){
                        from_date = 0;
                    }
                    // gte >=   lte <=
                    query = { post_date: { $gte: from_date , $lte: !to_date ? currentDate : to_date } }
                    const result = await Posts.find( query ).sort({post_date: 'desc'})
                        .skip(!page ? 1 : page)
                        .limit(!limit ? 10 : limit)
                        .exec();
                    if (result.length !== 0) {
                        return {
                            count: result.length,
                            posts: result
                        };
                    } else {
                        throw new Error(errorName.NOT_FOUND_DATA);
                    }
                } else {
                    throw new Error(errorName.UNAUTHORIZED);
                }
            } catch (err) {
                throw err;
            }
        }
    },
    searchPost: {
        type: listPostsType,
        args: {
            access_token: { type: GraphQLString },
            search: { type: GraphQLString },
            page: { type: GraphQLInt },
            limit: { type: GraphQLInt },
        },
        description: "search post by title or content",
        resolve: async (parent, { search, access_token, page, limit }, context) => {
            try {
                if (!access_token || access_token === '') {
                    if (!context.requestuest.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null || context.request.isAuth) {
                    var userId = !context.request.isAuth ? userInfo.userId : context.request.userId;
                    var searchInput = search.toLowerCase();
                    // const result = await Posts.find({ $text: { $search: search } })
                    //     // .sort()
                    //     .skip(page)
                    //     .limit(limit)
                    //     .exec(function (err, docs) {
                    //         console.log(err);

                    //         console.log(docs);
                    //         return docs;
                    //     });

                    // like
                    const result = await Posts.find({
                        $or: [
                            { post_meta_title: { $regex: searchInput } },
                            { post_meta_content: { $regex: searchInput } },
                            { post_title: { $regex: searchInput } },
                            { post_content: { $regex: searchInput } },
                            { article_title: { $regex: searchInput } },
                            { article_content: { $regex: searchInput } },
                        ]
                    })
                        .sort()
                        .skip(page)
                        .limit(limit)
                        .exec();
                    if (result.length !== 0) {
                        return result;
                    } else {
                        throw new Error(errorName.NOT_FOUND_DATA);
                    }
                } else {
                    throw new Error(errorName.UNAUTHORIZED);
                }
            } catch (err) {
                throw err;
            }
        }
    },
}
module.exports.PostResolverMutation = {
    createPosts: {
        type: listPostsType,
        description: "Tạo danh sách bài viết mới",
        args: {
            access_token: { type: GraphQLString },
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
                        })
                    })
                )
            }
        },
        resolve: async (parent, { input, access_token }, context) => {
            try {
                if (!access_token || access_token === '') {
                    if (!context.request.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null || context.request.isAuth) {
                    var creator = !context.request.isAuth ? userInfo.userId : context.request.userId;
                    return await Promise.all(
                        input.map(postInput => {
                            const posts = new Posts({
                                post_date: currentDate,
                                post_edit_at: currentDate,
                                post_content: postInput.post_content,
                                post_title: postInput.post_title,
                                post_meta_title: stringUtil.xoa_dau(postInput.post_title),
                                post_meta_content: stringUtil.xoa_dau(postInput.post_content),
                                post_status: !postInput.post_status ? "0" : "1",
                                post_type: postInput.post_type,
                                post_has_article: 0,
                                article_title: "",
                                article_content: "",
                                post_like_count: 0,
                                post_comment_count: 0,
                                creator: creator,
                            });
                            if (postInput.post_has_article == 1) {
                                posts.post_has_article = postInput.post_has_article;
                                posts.article_title = !postInput.article_title ? postInput.post_title : postInput.article_title;
                                posts.article_content = !postInput.article_content ? postInput.article_content : postInput.article_content;
                            }
                            // Posts.createIndex({ post_title: "text" , post_content:"text" });
                            return posts.save();
                        })
                    ).then(listPost => {
                        return listPost;
                    }).catch(err => {
                        throw new Error(errorName.POST_CREATE_ERROR);
                    });
                } else {
                    throw new Error(errorName.UNAUTHORIZED);
                }

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
                    if (!context.request.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null || context.request.isAuth) {
                    const post = await Posts.findById(input.posts_id);
                    if (!post) {
                        throw new Error(errorName.POST_NOT_FOUND_BY_ID);
                    } else {
                        var userId = !context.request.isAuth ? userInfo.userId : context.request.userId;
                        // update post count 
                        const commentCount = parseInt(post.post_comment_count) + 1;
                        post.post_comment_count = commentCount;
                        const postUpdate = await post.save();
                        const comment = new Comments({
                            user_id: userId,
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
                    if (!context.request.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null || context.request.isAuth) {
                    const post = await Posts.findById(input.posts_id);
                    if (!post) {
                        throw new Error(errorName.POST_NOT_FOUND_BY_ID);
                    } else {
                        var userId = !context.request.isAuth ? userInfo.userId : context.request.userId;
                        // update post count like
                        const likeCount = input.like_status ? parseInt(post.post_like_count) + 1
                            : parseInt(post.post_like_count) - 1;
                        post.post_like_count = likeCount;
                        const postUpdate = await post.save();

                        const like = new Like({
                            user_id: userId,
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
                    if (!context.request.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null || context.request.isAuth) {
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
    editPost: {
        type: PostType,
        description: "sửa bài viết mới",
        args: {
            access_token: { type: GraphQLString },
            input: {
                type: new GraphQLInputObjectType({
                    name: 'PostsEditInput',
                    fields: () => ({
                        id: { type: new GraphQLNonNull(GraphQLString) },
                        post_title: { type: GraphQLString },
                        post_title: { type: GraphQLString },
                        post_content: { type: GraphQLString },
                        post_status: { type: GraphQLString },
                        post_type: { type: GraphQLString },
                        post_has_article: { type: GraphQLInt },
                        article_title: { type: GraphQLString },
                        article_content: { type: GraphQLString },
                    })
                })

            }
        },
        resolve: async (parent, { input, access_token }, context) => {
            try {
                if (!access_token || access_token === '') {
                    if (!context.request.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null || context.request.isAuth) {
                    var creator = !context.request.isAuth ? userInfo.userId : context.request.userId;
                    var id = input.id;
                    const posts = {
                        post_edit_at: currentDate,
                        post_content: input.post_content,
                        post_title: input.post_title,
                        post_meta_title: stringUtil.xoa_dau(input.post_title),
                        post_meta_content: stringUtil.xoa_dau(input.post_content),
                        post_status: !input.post_status ? "0" : "1",
                        post_type: input.post_type,
                        post_has_article: 0,
                        article_title: "",
                        article_content: "",
                        post_like_count: 0,
                        post_comment_count: 0,
                        creator: creator,
                    };
                    if (input.post_has_article == 1) {
                        posts.post_has_article = input.post_has_article;
                        posts.article_title = !input.article_title ? input.post_title : input.article_title;
                        posts.article_content = !input.article_content ? input.article_content : input.article_content;
                    }
                    // Posts.createIndex({ post_title: "text" , post_content:"text" });
                    reslt = await Posts.findByIdAndUpdate(id, { $set: posts } , (err , res) =>{
                    });
                    if(!reslt.errors){
                        return posts;
                    }else{
                        throw new Error(errorName.EDIT_POST_FAIL);
                    }
                    
                } else {
                    throw new Error(errorName.UNAUTHORIZED);
                }

            } catch (err) {
                throw err;
            }

        }

    },
}