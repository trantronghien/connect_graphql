
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    checkAccessToken : access_token => {
        if (!access_token  || access_token === '') {
            return false;
        } else {
            let decodedToken = jwt.verify(access_token, process.env.SECRET_KEY);
            return decodedToken;
        }
    }
}