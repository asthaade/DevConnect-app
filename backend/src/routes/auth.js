const express = require('express');
const authRouter = express.Router();
const {validateSignUpData} = require('../utils/validation.js');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');

authRouter.post('/signup',async(req,res)=>{
    try{
    //Validation of data
    validateSignUpData(req);

    const {firstName, lastName, emailId, password} = req.body;

    //Encrypt the password
    const hashedPassword = await bcrypt.hash(password,10);

    const user =  new User({
        firstName,
        lastName,
        emailId,
        password:hashedPassword,
    });

    //console.log(" Hashedpassword : " +hashedPassword);

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        })
        res.json({ message : "Added User successfully! ", data : savedUser});
        
    } catch(err){
        res.status(400).send(" ERROR: "+ err.message);
    }
});

//GET API for logging the account
authRouter.post('/login',async(req,res)=>{
    try{
        
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        //console.log("User password : " + password)

        if(!user){
            throw new Error("Invalid Credentials ");
        }

        const isPasswordValid = await user.validatePassword(password);
        //console.log(isPasswordValid);

        if(isPasswordValid){
        //Create a JWT token
        const token = await user.getJWT();

        //Add token to cookie and send back to the user
        res.cookie("token",token,{
            expires: new Date(Date.now() + 8 * 360000),
        });
        res.send(user);
        }else{
            throw new Error("Invalid Credentials ")
        }
    }catch(err){
        res.status(400).send(" ERROR: "+ err.message);
    }
});

authRouter.post('/logout',async(req,res)=>{

    res.cookie("token",null ,{
        expires: new Date(Date.now())
    });
    res.send("user logout Successfully !");
});

module.exports = authRouter;