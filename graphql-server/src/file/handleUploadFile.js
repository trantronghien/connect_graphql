let multer = require("multer");
let fs = require("fs");
const UPLOAD_DIR = process.env.UPLOAD_DIR
var dir = `./${UPLOAD_DIR}`;
// Khởi tạo biến cấu hình cho việc lưu trữ file upload
let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    if (!fs.existsSync(dir)){
      console.log('create upload folder: ' + dir);
      fs.mkdirSync(dir);
    }
    console.log("upload dir: " + UPLOAD_DIR);
    callback(null, UPLOAD_DIR);
  },
  filename: (req, file, callback) => {
    // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
    // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg

    // let math = ["image/png", "image/jpeg"];
    // if (math.indexOf(file.mimetype) === -1) {
    //   let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
    //   return callback(errorMess, null);
    // }
    // console.log(req);
    
    // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
    let filename = `${Date.now()}_${file.originalname}`;
    callback(null, filename);
  }
});
// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
module.exports = uploadFile = multer({storage: diskStorage}).single("file");