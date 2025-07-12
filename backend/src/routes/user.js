const express = require('express');
const userRouter = express.Router();
const userAuth = require('../Middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const USER_SafeData = "firstName lastName age  photoUrl gender about skills ";

userRouter.get('/user/requests/received',userAuth,async(req,res)=>{
    try{

        const loggedInUser = req.user;
        
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status:"interested",
        }).populate("fromUserId", USER_SafeData);

        res.json({
            message: "Data Fetched Successfully ! " ,
            data: connectionRequests,
        });
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});


userRouter.get('/user/connections', userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId : loggedInUser._id , status :"accepted"},
                {toUserId:  loggedInUser._id , status : "accepted"}
            ],
        }).populate("fromUserId" , USER_SafeData)
        .populate("toUserId" , USER_SafeData)

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({data});
    }catch(err){
        res.status(400).send("ERROR : " +err.message);
    }
});

userRouter.get('/feed', userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or:[{fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id},
            ],
        }).select("fromUserId toUserId");

        const hideUserFromFeed =  new Set();
        connectionRequests.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId._id.toString());
            hideUserFromFeed.add(req.toUserId._id.toString());
        });

        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUserFromFeed)}},
                {_id:{$ne: loggedInUser._id}},
            ],
        }).select(USER_SafeData)
        .skip(skip)
        .limit(limit);

        res.json({data : users});
    }catch(err){
        res.json({message: err.message});
    }
});
module.exports  = userRouter;