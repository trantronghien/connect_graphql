exports.errorName = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    USER_NOT_EXISTS: 'USER_NOT_EXISTS',
    PASSWORD_INCORRECT: 'PASSWORD_INCORRECT',
    ORTHER: 'ORTHER',
    POST_CREATE_ERROR: 'POST_CREATE_ERROR',
    POST_NOT_FOUND_BY_ID: 'POST_NOT_FOUND_BY_ID',
    POST_NOT_FOUND: 'POST_NOT_FOUND',
}

exports.errorType = {
    UNAUTHORIZED: {
        message: 'Authentication is needed to get requested response.',
        statusCode: 401
    },
    USER_NOT_EXISTS: {
        message: 'User does not exist!',
        statusCode: 401
    },
    PASSWORD_INCORRECT: {
        message: 'Password is incorrect!',
        statusCode: 401
    },
    POST_CREATE_ERROR: {
        message: 'Không thể tạo bài viết này',
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
    ORTHER: {
        message: 'unknows',
        statusCode: 404
    }
}