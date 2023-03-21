const passport=require('passport')
const User=require('../models/User')
const Role=require('../models/Roles')
const { find } = require('lodash')
exports.authorization=(roles=[])=>(req,res,next)=>{
    passport.authenticate("jwt",{session:false},async(err,user,info)=>{
    if(!roles.length){
        return res.status(401).send("unauthorized")
    }
     const finduser= await User.findOne({_id:user._id})
     if(!finduser){
         return res.status(404).send("unauthorized")
     }
     const role= await Role.findOne({_id:finduser.role})
     if(roles.includes(role.role)){
        req.user=user
        return next()
     }
     else{
        return res.status(400).send("role not assingned")
     }

    })(req,res,next)
}
exports.isAdmin=(req,res,next)=>{
    passport.authenticate("jwt",{session:false},async(err,user,info)=>{
        const finduser=await  User.findOne({_id:user._id})
        if(!finduser){
            return res.status(404).send("unauthorized")
        }
        const isAdmin= await  Role.findOne({role:'admin'})
        if(!isAdmin){
            return res.status(404).send("role not found")
        }
        if(finduser.role.includes(isAdmin._id)){
            req.user=user
            return next()
        }
        else{
            res.send("accessdenied");
        }
    })(req,res,next)
}