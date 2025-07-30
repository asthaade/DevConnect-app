const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../Middlewares/auth.js');
const {validateEditProfileData} = require('../utils/validation.js');

profileRouter.get('/profile/view',userAuth, async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send(" ERROR: "+ err.message);
    }
});

profileRouter.patch('/profile/edit',userAuth, async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Error! ");
        }
        const loggedInUser = req.user;
        
        Object.keys(req.body).forEach((key) => (loggedInUser[key]= req.body[key]));
        await loggedInUser.save();
        res.json( {message : `${loggedInUser.firstName},Your Profile is updated successfully `,
        data : loggedInUser});
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

profileRouter.patch('/profile/edit/password',userAuth,async(req,res)=>{
    try{
        
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

module.exports = profileRouter;