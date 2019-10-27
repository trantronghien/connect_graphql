const { ObjectTypeComposer, schemaComposer } = require('graphql-compose');
// const { GraphQLUpload } = require('apollo-upload-server');
const graphql = require('graphql');
const { GraphQLUpload } = require('apollo-server-koa');
const { FileType } = require('../../models/File');
const mkdirp = require('mkdirp');
const promisesAll = require('promises-all');
const { createWriteStream, unlink } = require('fs')

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLInputObjectType
} = graphql;


/**
 * Stores a GraphQL file upload. The file is stored in the filesystem and its
 * metadata is recorded in the DB.
 * @param {GraphQLUpload} upload GraphQL file upload.
 * @returns {object} File metadata.
 */
const storeUpload = async upload => {
    // Ensure upload directory exists.
    mkdirp.sync(UPLOAD_DIR)

    const { createReadStream, filename, mimetype } = await upload
    const stream = createReadStream()
    const id = shortid.generate()
    const path = `${UPLOAD_DIR}/${id}-${filename}`
    const file = { id, filename, mimetype, path }
  
    // Store the file in the filesystem.
    await new Promise((resolve, reject) => {
      stream
        .on('error', error => {
          unlink(path, () => {
            reject(error)
          })
        })
        .pipe(createWriteStream(path))
        .on('error', reject)
        .on('finish', resolve)
    })
  
    // Record the file metadata in the DB.  
    // db.get('uploads')
    //   .push(file)
    //   .write()
  
    return file
  }

module.exports.fileResolverMutation = {
    // name: 'FileMutation',
   
      singleUpload: {
        description: 'Stores a single file.',
        type: GraphQLNonNull(FileType),
        args: {
            file: {
                description: 'File to store.',
                type: GraphQLNonNull(GraphQLUpload)
            }
        },
        resolve: async (parent, { file }, { storeUpload }) => {
          console.log(file);
        }
      },
      // multipleUpload: {
      //   description: 'Stores multiple files.',
      //   type: GraphQLNonNull(GraphQLList(GraphQLNonNull(FileType))),
      //   args: {
      //     files: {
      //       description: 'Files to store.',
      //       type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLUpload)))
      //     }
      //   },
      //   async resolve(parent, { files }, { storeUpload }) {
      //     const { resolve, reject } = await promisesAll.all(
      //       files.map(storeUpload)
      //     )
  
      //     if (reject.length)
      //       reject.forEach(({ name, message }) =>
      //         console.error(`${name}: ${message}`)
      //       )
  
      //     return resolve
      //   }
      // }
};


// schemaComposer.set('Upload', GraphQLUpload);
// schemaComposer.add(GraphQLUpload);

// module.exports.fileResolverMutation = schemaComposer.Mutation.addFields({
//     uploadFile: {
//       type: new GraphQLObjectType({
//         name: 'Posts',
//         fields: () => ({
//             _id: { type: GraphQLID },
//             fileName: { type: GraphQLString },
//         })
//       }),
//       args: {
//         file: '[Upload]',
//       },
//       resolve: async (_, {  file }) => {
//           console.log(file);
          
//         // const newPost = { id, title, authorId };
  
//         // somehow work with files
//         // if (poster) {
//         //   console.log(poster);
//         //   console.log(await poster);
//         // }
  
//         // somehow save a new record
//         // posts.push(newPost);
  
//         // return newPost;
//         return { id: "1" , file: "unknows"}
//       },
//     },
// });
