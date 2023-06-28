const ErrorHandler = require("../utils/errorHandler")

module.exports = (err, req, res, next) => {
    err.statuscode = err.statuscode || 500;
    
    if(process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(err.statuscode).json({
            success: false,
            error: err,
            errMassage: err.message,
            stack: err.stack
            });
    } else if(process.env.NODE_ENV === "PRODUCTION") {
        let error = {...err};
        error.message = err.message
        
        /*handle errormongoose id error */
        if(err.name === "castError") {
            const message = `Resource not found. invalid ${err.path}`;
            error = new ErrorHandler(message, 404);
        }
        //handle mongoose validation error
        if(err.name === "mongooseValidationError") {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);
        }
        //handle mongoose duplicate errors
        if(err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message,400)
        }    
        //handle jwt errors
        if(err.name === "JsonWebTokenError") {
            const message = "Invalid token. Try again";
            error = new ErrorHandler(message, 400);
        }
        //handle jwt expired errors
        if(err.name === "TokenExpiredError") {
            const message = "Token expired. Login again";   
            error = new ErrorHandler(message, 400);
        }
        res.status(error.statuscode).json({
            success: false,
            message: error.stack ||  "internal server error"
        });
    } 
}
