const mongoose=require('mongoose')
const connectdb=async ()=>{
try{
    conn=await mongoose.connect(process.env.MONGO_URI,{
        // useNewUrlParser:true,
        // useUnifiedTopology:true,
        // useFindAndModify:true
    })
    console.log('Mongo connected')
}catch(error){
    console.log(error.message)
    process.exit()
}
}
module.exports=connectdb