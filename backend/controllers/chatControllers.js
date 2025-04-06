const asyncHandler=require('express-async-handler')
const chat=require('../models/chatModel')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')
const accessChat=asyncHandler(async(req,res)=>{
    const {userId}=req.body
    if(!userId){
        console.log("User id not in params")
        return res.sendStatus(400)
    }
    var isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
            
        ]
    }).populate("users","-password")
    .populate("latestMessage")
    isChat=await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name pic email"
    })
    if(isChat.length>0){
        res.send(isChat[0])
    }else{
       var chatData={
        chatName:"sender",
        isGroupChat:false,
        users:[req.user._id,userId],
       }
       try{
        const createdChat=await Chat.create(chatData)
        const fullChat=await Chat.findOne({_id:createdChat._id}).populate(
            "users",
            "-password"
        )
        res.status(200).send(fullChat)

       }catch{
        res.status(400)
        throw new Error(error.message)
       }
    }
})
const fetchChats=asyncHandler(async(req,res)=>{
    // if we didnt used populate then only ids will come  
    try{
        let results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

    results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    res.status(200).send(results);
} catch (error) {
    res.status(400);
    throw new Error(error.message);
    }
})
const creategroupchat=asyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"Please fill all details"});
    }
    var users=JSON.parse(req.body.users)
    if(users.length<2){
        return res.status(400).send("More than 2 usrs are needed.")
    }
    users.push(req.user)
    try{
        const groupchat=await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
        })
        const fullgroupchat=await Chat.findOne({_id:groupchat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        res.status(200).json(fullgroupchat)
    }catch(error){
        res.status(400)
        throw new Error(error.message)
    }
})
const rename=asyncHandler(async(req,res)=>{
    const {chatId,chatName}=req.body
    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")
    if(!updatedChat){
        res.status(404)
        throw new Error("Chat Not Found")
    }else{
        res.json(updatedChat)
    }
})
const addtogroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body
    const added=await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId}
        },{
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")
    if(!added){
        res.status(404)
        throw new Error("Chat Not Found")
    }else{
        res.json(added)
    }
})
const removefromgroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body
    const removed=await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId}
        },{
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")
    if(!removed){
        res.status(404)
        throw new Error("Chat Not Found")
    }else{
        res.json(removed)
    }
})
module.exports={accessChat,fetchChats,creategroupchat,rename,addtogroup,removefromgroup}