require('dotenv').config()
const User= require('../models/User')
const jwtStrategy=require("passport-jwt").Strategy


function initializePassport(passport){
    function cookieExtractor(req){
        let jwt = null;
        if(req && req.cookies){
            jwt =  req.cookies['token']
        }
        return jwt
    }
    const options = {
        jwtFromRequest:cookieExtractor,
        secretOrKey:process.env.SECRET_KEY
    }
    passport.use(new jwtStrategy(options,async(jwt_payload,done)=>{
        let user = await User.findOne({_id:jwt_payload.id})
        if(!user){
            done(null,false);
        }else{
            done(null,user);
        }
    }))
}



module.exports={initializePassport} 
