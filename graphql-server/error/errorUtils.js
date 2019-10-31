exports.errorName = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    UNAUTHORIZED_NOT_ADMIN: 'UNAUTHORIZED_NOT_ADMIN',
    USER_NOT_EXISTS: 'USER_NOT_EXISTS',
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
    MAIL_NOT_AVAILABLE: 'MAIL_NOT_AVAILABLE',
    PASSWORD_INCORRECT: 'PASSWORD_INCORRECT',
    ORTHER: 'ORTHER',
    POST_CREATE_ERROR: 'POST_CREATE_ERROR',
    POST_NOT_FOUND_BY_ID: 'POST_NOT_FOUND_BY_ID',
    POST_NOT_FOUND: 'POST_NOT_FOUND',
    NOT_FOUND_DATA: 'NOT_FOUND_DATA',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    KEY_FILE_NOT_FOUND: 'KEY_FILE_NOT_FOUND',  
    UNAUTHORIZED_DELETE: 'UNAUTHORIZED_DELETE',
    EDIT_POST_FAIL: 'EDIT_POST_FAIL',
}

exports.errorType = {
    UNAUTHORIZED: {
        message: 'Authentication is needed to get requested response.',
        statusCode: 401
    },
    UNAUTHORIZED_NOT_ADMIN:{
        message: 'Authentication bạn không có quyền admin',
        statusCode: 401
    },
    UNAUTHORIZED_DELETE:{
        message: 'unauthorized delete',
        statusCode: 401
    },
    USER_NOT_EXISTS: {
        message: 'User does not exist!',
        statusCode: 401
    },
    USER_ALREADY_EXISTS:{
        message: 'user already exists',
        statusCode: 401
    },
    MAIL_NOT_AVAILABLE: {
        message: 'email not available',
        statusCode: 401
    },
    PASSWORD_INCORRECT: {
        message: 'Password is incorrect!',
        statusCode: 401
    },
    POST_CREATE_ERROR: {
        message: 'Không thể tạo bài viết này, phải có đầy đủ trường bắt buộc',
        statusCode: 400
    },
    POST_NOT_FOUND_BY_ID:{
        message: 'post not found by id',
        statusCode: 404
    },
    POST_NOT_FOUND:{
        message: 'post not found',
        statusCode: 404
    },
    NOT_FOUND_DATA:{
        message: 'not found data',
        statusCode: 404
    },
    FILE_NOT_FOUND: {
        message: 'file not found',
        statusCode: 404
    },
    KEY_FILE_NOT_FOUND: {
        message: 'key file not found',
        statusCode: 404
    },
    EDIT_POST_FAIL:{
        message: 'edit post fail',
        statusCode: 404
    },
    ORTHER: {
        message: 'unknows',
        statusCode: 404
    }
}