const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
var os = require('os');
var ifaces = os.networkInterfaces();
var fs = require('fs');
require('dotenv').config();

const { apolloUploadExpress } = require('apollo-upload-server');

// const schema = require('./src/Schema');
const schema = require('./src/schema_root');
const mongoose = require('mongoose');
const isAuth = require('./middleware/auth');
const getErrorCode = require('./error/error');
let uploadFile = require('./src/file/handleUploadFile');
const saveInfoFile = require('./src/file/storeFileToDb');
const { errorName } = require('./error/errorUtils');


const app = express();

// app.post(fileHandler.uploadFile);
app.post("/upload", (req, res) => {
  uploadFile(req, res, (error) => {
    var response = {
      filename: "",
      file_key: "",
    };
    try {
      if (error) {
        throw new Error(`Error when trying to upload: ${error}`);
      }
      const reslt = saveInfoFile.saveInfoFileToDb(req.file, "5da876b1f0e77303047e03af");

      reslt.then(reslt => {
        response.filename = reslt.file_name;
        response.file_key = reslt._id.toString();
        response.message = "success";

        res.status(200).json(response);
      }).catch(err => {
        throw err;
      })
    } catch (error) {
      response.message = "upload file fail " + error.message
      res.status(404).json(response);
    }
  })
});

app.get('/download', function (req, res) {
  var response = { message:"", error_code: 404 };
  try {
    const file = `${__dirname}/${process.env.UPLOAD_DIR}/${req.query.name}`;
    var download = !req.query.download ? 0 : 1;
    if (!fs.existsSync(file)) {
      throw new Error(errorName.FILE_NOT_FOUND);
    }
    if (!file) { throw new Error(errorName.KEY_FILE_NOT_FOUND) }
    if (download === 1) {
      res.download(file); // Set disposition and send it.
    } else {
      var filestream = fs.createReadStream(file);
      filestream.pipe(res);
    }
  } catch (error) {
    res.status(200).json(getErrorCode(error.message));
  }
});

// router.post("/multiple-upload", (req, res) => {

// });

// app.use(bodyParser.json());
// using middleware
app.use(isAuth);

app.use('/graphql',
  bodyParser.json(),
  apolloUploadExpress(/* Options */),
  graphqlHTTP(async (request, response, graphQLParams) => {
    // console.log("query raw: " + graphQLParams.query);
    return {
      schema,
      graphiql: process.env.NODE_ENV === 'development',
      context: { request },
      customFormatErrorFn: (err) => {
        const error = getErrorCode(err.message);
        const stackError = process.env.NODE_ENV === 'development' ? err.stack : "";
        if (!error) {
          return ({ message: "Internal server error: " + err.message, statusCode: 501, stack: stackError });
        }
        return ({ message: error.message, statusCode: error.statusCode, stack: stackError });
      }
    };
  })
);


// app.get('/',(req , res , next) =>{
//     res.send("hello ");
// });

const connectString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-gi2y8.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
console.log(connectString);

mongoose.connect(connectString).then(() => {
  console.log("connected monogo db");
}).catch(err => {
  console.error("can't connect mongo db");
});
app.listen(3000);
// app.listen(3000, () => {
//   Object.keys(ifaces).forEach(function (ifname) {
//     var alias = 0;

//     ifaces[ifname].forEach(function (iface) {
//       if ('IPv4' !== iface.family || iface.internal !== false) {
//         // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
//         return;
//       }

//       if (alias >= 1) {
//         // this single interface has multiple ipv4 addresses
//         console.log(ifname + ':' + alias, iface.address);
//       } else {
//         // this interface has only one ipv4 adress
//         console.log(ifname, iface.address);
//       }
//       ++alias;
//     });
//   });
// });

