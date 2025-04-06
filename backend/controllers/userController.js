// Error handling: Normally, when you're working with async code in Express, you'd need to use try-catch blocks to handle any potential errors. With express-async-handler, you don't need to manually wrap your async route handlers in try-catch blocks. If any error occurs within the handler, it will be automatically passed to Express's error handling middleware.
const asyncHandler=require('express-async-handler')
const User=require('../models/userModel')
const generateToken=require('../config/generateToken')
const registerUser=asyncHandler(async (req,res)=>{
    const {name,email,password,pic}=req.body;
    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please enter all the fiels')
    }
    const userexists=await User.findOne({email})
    if(userexists){
        throw new Error('User already exists.')
    }
    const user=await User.create({name,email,password,pic})
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        res.json(400)
        throw new Error('Failed to create user')
    }
})

const authUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error("Invalid error")
    }
})
// it is req.query then ?search=piyush.. 
const allusers=asyncHandler(async(req,res)=>{
    const keyword=req.query.search
    ?
    {
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ],
    }:{}
    const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
    res.send(users);
})
module.exports={registerUser,authUser,allusers}