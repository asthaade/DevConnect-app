const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema(
{
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['sent', 'seen'],
        default: 'sent'
    }
},
{ timestamps: true }
);


const chatsSchema = new mongoose.Schema({
    participants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
    ],
    messages:[messagesSchema],
})

const Chat = mongoose.model('Chat',chatsSchema);
const Message = mongoose.model('Message',messagesSchema);

module.exports = {
    Chat,
    Message
};