const mongoose = require('mongoose');
const user = require('./user.js');

const connectionRequestSchema = mongoose.Schema({
    fromUserId :{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:user,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:user,
    },
    status:{
        type:String,
        required:true,
        enum:["ignored" , "interested","accepted","rejected"],
        message:`{VALUE} is invalid status type`,
    }
},{timestamps:true});

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    // Check if the fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
});

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports = ConnectionRequest;