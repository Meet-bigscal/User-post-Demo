const mongoose=require('mongoose');
const bcrypt=require('bcrypt')

const Userschema=  new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  username:{
    type: String,
     required:true
  },
  email:{
    type:String,
    required:true
  },
  role:[{
    type: mongoose.Types.ObjectId,
    ref:"Role"
  }],
  password:{
    type:String,
    required:true
  },
 
  isDeleted:{
    type:Boolean,
    default:0
  },
  deletedBy:{
    type:Date,
    default:Date.now
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

Userschema.pre('save',async function save(next) {
  try{
    this.password= await bcrypt.hash(this.password,10)
    return next()
  }catch(error){
    return next(error)
  }
  
})
module.exports=  new  mongoose.model("User",Userschema)