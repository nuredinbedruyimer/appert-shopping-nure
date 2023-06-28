const User = require('../models/users');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require(`../middlewares/catchAsyncError`);
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Register a user   => /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "Avatar",
        width: 150,
        crop: "scale",
      });

    const newuse = {...req.body, avatar: {
        public_id: myCloud.public_id,
        url: myCloud.url
    }}
    const {name, password , email} = req.body;
    const newUser = await User.create(newuse) 
    sendToken(newUser, 200, res)
})
exports.loginUser = catchAsyncError(async (req,res,next) => {
    const {email, password} = req.body
    if(!email||!password){
        return next(new ErrorHandler("please enter email and password",400))
    }
    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401))
    }
    
    const isPasswordMatched = await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401))
    }

    sendToken(user, 200, res)
})
//logout user => delete token from cookies
exports.logoutUser = catchAsyncError(async (req,res,next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        status: "success",
        message: "Logout success"
    })
})
//forgot password
exports.forgotPassword = catchAsyncError(async (req, res,next) => {
    const user = await User.findOne({email: req.body.email});
    
    if(!user) {
        return next(new ErrorHandler("user email not found",404))
    }

    const passwordToken =  user.getResetPasswordToken();
    await user.save({validateBeforeSave:false})
    //create reset password url
    const passwordUrl = `${process.env.FRONTEND_URL}/password/reset/${passwordToken}`
    const message = `your password reset token is as follows:\n\n ${passwordUrl} \n\n If you have not requested
    this email then ignore it.`
    try {
        await sendEmail({
            email:user.email,
            subject: `password reset`,
            message
        })
        res.status(200).json({
            success: true,
            message: `email sent to ${user.email}`
        })
    } catch (error) {
        user.ResetPasswordToken = undefined;
        user.ResetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message,500))

    }
})

exports.resetPassword = catchAsyncError(async (req, res,next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        hashedToken,
        ResetPasswordExpire: {$gt: Date.now()}
    })
    if(!user){
        return next(new ErrorHandler("invalid token",400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("password and confirm password do not match",400))
    }
    user.password = req.body.password;
    user.ResetPasswordToken = undefined;
    user.ResetPasswordExpire = undefined;
    await user.save()
    sendToken(user, 200, res)
} )
//logged profile
exports.getUserProfile = catchAsyncError(async (req, res,next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})
//update password
exports.updatePassword = catchAsyncError(async (req, res,next) => {
    const user = await User.findById(req.user.id).select('+password')
    if(!(await user.comparePassword(req.body.oldPassword))){
        return next(new ErrorHandler("old password is incorrect",400))
    }
    user.password = req.body.newPassword;
    await user.save()
    sendToken(user, 200, res)
}) 
//update profile
exports.updateProfile = catchAsyncError(async (req, res,next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    // Update avatar
    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
} )
//admin get all users
exports.getAllUsers = catchAsyncError(async (req, res,next) => {
    const users = await User.find()
    res.status(200).json({
        success: true,
        users
    })
} )
//admin get single user
exports.getSingleUser = catchAsyncError(async (req, res,next) => {
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler("user not found",404))
    }
    res.status(200).json({
        success: true,
        user
    })
} )
// admin update user
exports.updateUser = catchAsyncError(async (req, res,next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, 
        runValidators: true,
        userFindAndModify: false})
    if(!user){
        return next(new ErrorHandler("user not found",404))
    }
    res.status(200).json({
        success: true
    })
} )
//admin delete user
exports.deleteUser = catchAsyncError(async (req, res,next) => {
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler("user not found",404))
    }

    const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id);

    await user.remove();
    res.status(200).json({
        success: true
    })
} )