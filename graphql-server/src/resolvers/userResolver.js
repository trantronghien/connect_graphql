const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const graphql = require('graphql');
const User = require('../../models/user');
const { dateToString, currentDate } = require('../../utils/dateUtils');
const stringUtil = require('../../utils/StringUtils');
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
        permission: { type: GraphQLString },
        message: { type: GraphQLString }
    })
});

const UserInput = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: () => ({
        email: { type: new GraphQLNonNull(GraphQLString) },
        permission: { type: GraphQLInt },
        password: { type: new GraphQLNonNull(GraphQLString) }
    })
});

module.exports.UserResolverQuery = {
    getUserInfo: {
        type: new GraphQLObjectType({
            name: 'UserInfo',
            fields: () => ({
                current_admin: { type: GraphQLString },
                _id: { type: GraphQLID },
                email: { type: GraphQLString },
                created: { type: GraphQLString },
                permission: { type: GraphQLString },
                message: { type: GraphQLString }
            })
        }),
        description: "Lấy thông tin user từ admin permission == 1, không hỗ trợ header",
        args: {
            email: { type: GraphQLString },
            access_token: { type: GraphQLString }
        },
        resolve: async (parent, args, context) => {
            try {
                if (!args.access_token || args.access_token === '') {
                    if (!context.request.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                } else {
                    let decodedToken = jwt.verify(args.access_token, process.env.SECRET_KEY);
                    if (decodedToken !== null) {
                        const adminUser = await User.findById(decodedToken.userId);
                        if(adminUser  !== null && adminUser.permission === 1){
                            const user = await User.findOne({ email: args.email });
                            if (!user || user.email === 'undefined') {
                                throw new Error(errorName.USER_NOT_EXISTS);
                            }
                            return {
                                _id: user._id,
                                current_admin: adminUser.email,
                                email: user.email,
                                created: user.created,
                                permission: user.permission,
                                message: "success"
                            };
                        }else{
                            throw new Error(errorName.UNAUTHORIZED_NOT_ADMIN);
                        }
                        
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
            try {
                const userFind = await User.findOne({ email: input.email });
                const hashedPassword = await bcrypt.hash(input.password, 12);
                
                if(stringUtil.isMail(input.email) == false){
                    throw Error(errorName.MAIL_NOT_AVAILABLE)
                }else{
                    if (userFind !== null) {
                        throw new Error(errorName.USER_ALREADY_EXISTS);
                    }
                    const user = new User({
                        email: input.email,
                        password: hashedPassword,
                        permission: 1,
                        created: currentDate
                    });
                    const result = await user.save();
                    return {
                        _id: result._id,
                        email: result.email,
                        created: result.created,
                        permission: result.permission,
                        message: "register success!!"
                    };
                }
            } catch (err) {
                throw err;
            }
        }

    },
    login: {
        type: new GraphQLObjectType({
            name: "AuthData",
            fields: () => ({
                userId: { type: GraphQLID },
                token: { type: GraphQLString },
                tokenExpiration: { type: GraphQLString }
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
            var SignOptions = {
                // algorithm: "ES512",
                expiresIn: "7d"
            };
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.SECRET_KEY,
                SignOptions
            );
            return { userId: user.id, token: token, tokenExpiration: SignOptions.expiresIn };
        }

    }
}