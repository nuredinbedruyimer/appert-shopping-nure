/* The ErrorHandler class is a custom error class that extends the Error class. */
class ErrorHandler extends Error{
    constructor(message, statuscode){
        super(message);
        this.statuscode = statuscode;
        Error.captureStackTrace(this,this.constructor);
        }
}

module.exports = ErrorHandler;