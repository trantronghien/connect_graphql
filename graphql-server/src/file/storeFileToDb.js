const Files = require('../../models/file_model');
const { dateToString, currentDate } = require('../../utils/dateUtils');
const { errorName } = require('../../error/errorUtils');
let path = require("path");
const jwt = require('jsonwebtoken');
var ffmetadata = require("ffmetadata");
const stringUtil = require('../../utils/StringUtils');


let saveInfoFileToDb = (file, userId) => {

    // console.log(`${file} ____ ${userId}`);

    const extension = path.extname(file.originalname);
    const metadata = "";
    // if (stringUtil.isAudioFile(extension)) {
    //     // Read song.mp3 metadata
    //     ffmetadata.read(file.path, function (err, data) {
    //         if (err) console.error("Error reading metadata", err);
    //         else console.log(data);
    //     });
    // }
    const fileInfo = new Files({
        user_id: userId, 
        file_name: file.filename,
        type_name: "avatar",
        upload_at: currentDate,
        media_type: file.mimetype,
        metadata: metadata,
        extension: extension,
        path: file.path,
        size: file.size
    });
    // return fileInfo;
    return fileInfo.save();
}

module.exports = {
    saveInfoFileToDb: saveInfoFileToDb
}