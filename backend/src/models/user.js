const mongoose = require("mongoose");
const validator =require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address "+ value);
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password "+ value);
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender is not valid");
            }
        },
    },
    photoUrl:{
        type:String,
        default:"https://geographyandyou.com/images/user-profile.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo url "+ value);
            }
        }
    },
    about:{
        type:String,
        default:"This is my default bio",
    },
    skills:{
        type:[String],
    }
},{timestamps:true});


userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({_id :user._id},"DEV@connect112",{expiresIn : '7d'});

    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user  = this;
    const hashedPassword = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser,hashedPassword)
    
    return isPasswordValid;
}
const User = mongoose.model("User",userSchema);

module.exports = User;