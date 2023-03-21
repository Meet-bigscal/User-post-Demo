const role = require("../models/role")

const  checkrole=(req,res,next)=>{
    if(req.body.role){
        for(let i=0;i<req.body.role.length;i++){
            if(!role.includes(req.body.role[i])){
                return res.status(400).json({
                    message:"Invalid role"
                })
            }
        }
    }
    next()
}

module.exports=checkrole