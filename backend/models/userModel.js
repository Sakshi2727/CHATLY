const bcrypt=require('bcryptjs')
const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    pic:{type:String,default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
}, 
// timestamps for new message to be seen at top 
{timestamps:true})
userSchema.methods.matchPassword=async function(enteredpassword){
    return bcrypt.compare(enteredpassword,this.password)
}
// In your code, before proceeding with hashing the password, you check if the document has been modified. If the password hasn't changed (or no fields have been modified), the middleware will skip the password hashing process.
userSchema.pre('save',async function (next){
    if(!this.isModified){

        next()
    }
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})
const User=mongoose.model("User",userSchema)
module.exports=User