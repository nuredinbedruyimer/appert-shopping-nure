const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Name is required"],
        maxLength: [50,"Name can't be more than 50 characters"]
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
        validate: [validator.isEmail,"Please provide a valid email"]
    },
    password: {
        type: String,
        required: [true,"Password is required"],
        minlength: [6,"Password must be at least 6 characters"],
        select: false
    },
    avatar: {
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

//encrypt password before saving to database
userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);

});
userSchema.methods.getJwtToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRES_TIME});
}
userSchema.methods.comparePassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}
//hash and reset passwordtoken
userSchema.methods.getResetPasswordToken = function(){
    const passwordToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken= crypto.createHash('sha256').update(passwordToken).digest('hex');
    this.resetPasswordExpire = Date.now()+30000*60
    return passwordToken;
}
module.exports = mongoose.model('User', userSchema);