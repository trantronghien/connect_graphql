
const graphql = require('graphql');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const File = require('../../models/file_model');

const { dateToString, currentDate } = require('../../utils/dateUtils');
const { errorName } = require('../../error/errorUtils');
const { config } = require('../../utils/config');
const User = require('../../models/user');

const { checkAccessToken } = require('../../utils/security');

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLInputObjectType
} = graphql;

// const checkAccessToken = access_token => {
//     if (!access_token  || access_token === '') {
//         return false;
//     } else {
//         let decodedToken = jwt.verify(access_token, process.env.SECRET_KEY);
//         return decodedToken;
//     }
// }

module.exports.FileResolverQuery = {
    getFile: {
        type: new GraphQLObjectType({
            name: "FileInfo",
            fields: () => ({
                key_file: { type: GraphQLID },
                link: { type: GraphQLString },
                link_download: { type: GraphQLString },
                media_type: { type: GraphQLString },
                upload_at: { type: GraphQLString },
            })
        }),
        description: "Lấy thông tin file bởi key file",
        args: {
            access_token: { type: GraphQLString },
            key_file: { type: GraphQLString }
        },
        resolve: async (parent, { key_file, access_token }, context) => {
            try {
                if (!access_token || access_token === '') {
                    if (!context.request.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null) {
                    var userId = !context.request.isAuth ? userInfo.userId : context.request.userId; 
                    const file = await File.findOne({ _id : key_file , user_id: userId});
                    if (!file) { throw new Error(errorName.KEY_FILE_NOT_FOUND) }
                    const PORT = process.env.PORT || 8080;
                    var pathFile;
                    if(process.env.DELOY_HEROKU){
                        pathFile = `${context.request.host}/download?name=${file.file_name}`
                    }else{
                        pathFile = `${context.request.host}:${PORT}/download?name=${file.file_name}`
                    }
                    return {
                        key_file: file._id.toString(),
                        link: pathFile,
                        link_download: pathFile + '&download=1',
                        media_type: file.media_type,
                        upload_at: dateToString(file.upload_at),
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

module.exports.FileResolverMutation = {
    deleteAllFile: {
        type: new GraphQLObjectType({
            name: "FileDeleteAll",
            fields: () => ({
                message: { type: GraphQLString },
                delete_record_db: { type: GraphQLInt },
                delete_record_dir: { type: GraphQLInt },
            })
        }),
        description: "Delete tất cả file",
        args: {
            access_token: { type: GraphQLString }
        },
        resolve: async (parent, { access_token }, context) => {
            try {
                if (!access_token || access_token === '') {
                    if (!context.req.isAuth) {
                        throw new Error(errorName.UNAUTHORIZED);
                    }
                }
                const userInfo = checkAccessToken(access_token);
                if (userInfo !== null) {
                    const user = await User.findById(userInfo.userId);
                    if (user.permission === 1) {
                        const file = await File.deleteMany({}, (err) => {
                            console.log(err);
                        });
                        // delete file in dir 
                        const directory = process.env.UPLOAD_DIR;
                        var countFileDeleted = 0;
                        fs.readdir(directory, (err, files) => {
                            if (err) throw err;
                            for (const file of files) {
                                countFileDeleted++;
                                fs.unlink(path.join(directory, file), err => {
                                    if (err){
                                        // countFileDeleted--;
                                        throw err;
                                    }
                                });
                            }
                        });
                        return {
                            message: "delete all file success",
                            delete_record_db: file.deletedCount,
                            delete_record_dir: countFileDeleted
                        }
                    } else {
                        throw new Error(errorName.UNAUTHORIZED_DELETE);
                    }

                } else {
                    throw new Error(errorName.UNAUTHORIZED);
                }
            } catch (err) {
                throw err;
            }

        }

    }
}