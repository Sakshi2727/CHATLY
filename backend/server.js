const express=require('express')
const dotenv=require('dotenv')
dotenv.config()
const app=express()
const chats=require("./data/data")
const connectdb = require('./config/db')
const userRoutes=require('./routes/userRoutes')
const chatRoutes=require('./routes/chatRoutes')
const messageRoutes=require('./routes/messageRoutes')
const cors = require('cors');
const path=require('path')

app.use(cors());
// console.log("Cloudinary URL:", process.env.REACT_APP_CLOUDINARY_URL);
connectdb()
// this is for server accepting user details in json format 
app.use(express.json())
// app.get("/",(req,res)=>{
//     res.send("yes it hit the api dkmd dhsjn. vkjnc g jned")
   
// })
// When you use app.use('/api/user', userRoutes), it means that userRoutes will handle requests for any HTTP method sent to the /api/user endpoint.
// userRoutes could be a router that contains multiple routes for different HTTP methods under the /api/user path.
app.use('/api/user',userRoutes)
// app.get('/api/chat', (req, res) => {
//     res.send(chats);
//   });
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes)
// app.use(notFound)

const __dirname1=path.resolve();
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname1,"..","frontend","build")))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"..","frontend","build","index.html"))
    })
}else{
    app.get("/",(req,res)=>{
        res.send("API is running successfully")
    })
}

// app.get("/api/chat/:id",(req,res)=>{
//     // console.log(req.params.id);
//     const singlechat=chats.find((c)=>c._id==req.params.id)
//     res.send(singlechat)
// })
const port=process.env.PORT || 5000
const server=app.listen(port,console.log("Server started"))
const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})
io.on("connection",(socket)=>{
    console.log("connected to socket.io")
    socket.on("setup",(userData)=>{
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit('connected')
    })
    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log("User joined room"+room,)
    })
    socket.on('newMessage',(newMessageRecieved)=>{
        var chat=newMessageRecieved.chat;
        if(!chat.users) return console.log('chat users not defined')
        chat.users.forEach(user=>{
          if(user._id===newMessageRecieved.sender._id) return 
          socket.in(user._id).emit("message recieved",newMessageRecieved)
        })

    })
})

