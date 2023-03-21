const mongoose=require('mongoose')

const PostSchema= new mongoose.Schema({
    title: {
        type: String,
        
      },
        description: {
        type: String,
        required: true,
        
      },
      image: {
        type: String,
      },
      
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      isDeleted:{
        type:Boolean,
        default:0
      },
      deletedBy:{
        type:String
      },
      deletedAt:{
        type:Date,
        default:Date.now
      },
      createdAt:{
        type:Date,
        default:Date.now
      },
      updatedAt:{
        type:Date,
        default:Date.now
      }    
})
module.exports=mongoose.model("Post",PostSchema)
