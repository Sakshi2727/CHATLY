const asyncHandler = require('express-async-handler')
const Message = require('../models/messageModel')
const User = require('../models/userModel')
const Chat = require('../models/chatModel')
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body
    if (!content || !chatId) {
        console.log("Invalid data passed into request")
        return res.sendStatus(400)
    }
    var newmessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }
    try {
        var message = await Message.create(newmessage)
        // this populates the name and pic of sender inside newMessage
        message = await message.populate("sender", "name pic")
        // this populates the chat and gives chatid with chat ,chatname,users.... details  and stores in the message
        message = await message.populate("chat")
        // this populates the chat with details of all users inside chat
        //   path: "chat.users":

        // Specifies the path to populate.
        // chat.users refers to the users field in the chat object. This field contains an array of ObjectIds pointing to documents in the User collection.
        // select: "name pic email":

        // Specifies the fields to include when populating the users array.
        // Instead of retrieving the entire user document, this fetches only the name, pic, and email fields for each user.
//         path: "chat.users": Tells Mongoose to look inside the chat.users field in the message object.
// select: "name pic email": Specifies that only the name, pic, and email fields should be retrieved from the User documents referenced by chat.users.
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        })
        await Chat.findByIdAndUpdate(req.body.chatid,{
            latestMessage:message
        })
        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})
const allMessages=asyncHandler(async(req,res)=>{
    try{
        // it means the sender field in message should be detail populated to get the details and so the chat field is also populated to get detials 
        const messages=await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat")
        res.json(messages)
    }catch(error){
        res.status(400)
        throw new Error(error.message)
    }
})
module.exports = {sendMessage,allMessages}