const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
var os = require('os');
var ifaces = os.networkInterfaces();

const { apolloUploadExpress } = require('apollo-upload-server');

// const schema = require('./src/Schema');
const schema = require('./src/schema_root');
const mongoose = require('mongoose');
const isAuth = require('./middleware/auth');
const getErrorCode = require('./error/error');
let uploadFile = require('./src/file/handleUploadFile');
const saveInfoFile = require('./src/file/storeFileToDb');


const app = express();

// app.post(fileHandler.uploadFile);
app.post("/upload", (req, res) => {
  uploadFile(req, res, (error) => {
    // Nếu có lỗi thì trả về lỗi cho client.
    // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
    try {
      if (error) {
        throw new Error(`Error when trying to upload: ${error}`);
      }
      const reslt = saveInfoFile.saveInfoFileToDb(req.file, "5da876b1f0e77303047e03af");
      reslt.then(reslt => {
        res.status(200).json({
          filename: reslt.file_name
        });
      }).catch(err => {
        throw err;
      })
    } catch (error) {
      res.status(404).json({
        message: "upload file fail " + error.message
      });
    }

    // Không có lỗi thì lại render cái file ảnh về cho client.
    // Đồng thời file đã được lưu vào thư mục uploads
    // res.sendFile(path.join(`${__dirname}/uploads/${req.file.filename}`));

  })
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

// const connectString = `mongodb+srv://user_1:Abc123456789@cluster0-gi2y8.gcp.mongodb.net/event-react?retryWrites=true&w=majority`
const connectString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-gi2y8.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

// console.log(`string connect:  ${connectString}`);

mongoose.connect(connectString).then(() => {
  console.log("connected monogo db");
}).catch(err => {
  console.error("can't connect mongo db");
});

app.listen(3000, () => {
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
      }
      ++alias;
    });
  });
});

