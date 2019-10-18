const { errorType } = require('./errorUtils')

const getErrorCode = errorName => {
    
  return errorType[errorName]
}

module.exports = getErrorCode