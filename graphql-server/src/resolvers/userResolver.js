const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const graphql = require('graphql');
const User = require('../../models/user');
const { dateToString } = require('../../utils/dateUtils');
const { errorName } = require('../../error/errorUtils');


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


const checkAccessToken = access_token => {
    if (!access_token) {
        return false;
    } else {
        if (!access_token || access_token === '') {
            return false;
        }
        let decodedToken = jwt.verify(access_token, process.env.SECRET_KEY);
        if (!decodedToken) {
            return false;
        }
        return true;
    }
}


module.exports.UserResolverQuery = {
    User: {
        type: UserType,
        args: {
            email: { type: GraphQLString },
            access_token: { type: GraphQLString }
        },
        resolve: async (parent, args, context) => {
            try {
                if (!args.access_token || args.access_token === '') {
                    if (!context.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                } else {
                    if (checkAccessToken(args.access_token)) {
                        const user = await User.findOne({ email: args.email });
                        if (!user || user.email === 'undefined') {
                            throw new Error(errorName.USER_NOT_EXISTS);
                        }
                        return {
                            _id: user._id,
                            email: user.email,
                            created: user.created
                        };
                    } else {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
            } catch (err) {
                throw err;
            }
        }
    }
}
module.exports.UserResolverMutation = {
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
                created: dateToString
            });
            const result = await user.save();
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
                throw new Error(errorName.USER_NOT_EXISTS);
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error(errorName.PASSWORD_INCORRECT);
            }
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.SECRET_KEY,
                {
                    expiresIn: '24h'
                }
            );
            return { userId: user.id, token: token, tokenExpiration: 1 };
        }

    }
}