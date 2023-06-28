const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/users")

exports.isAuthenticatedUser = catchAsyncError(async (req, res,next) => {

    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Login first to access the resource",401));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    next()
})
// handling autherizeRoles roles
exports.authorizeRoles = (...roles) => {
    
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} is not authorized to access this resource`,403))
        }
        next()
    }
}