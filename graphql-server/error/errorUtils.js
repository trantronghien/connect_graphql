exports.errorName = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    USER_NOT_EXISTS: 'USER_NOT_EXISTS',
    PASSWORD_INCORRECT: 'PASSWORD_INCORRECT',
    ORTHER: 'ORTHER',
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
    ORTHER: {
        message: 'unknows',
        statusCode: 401
    }
}