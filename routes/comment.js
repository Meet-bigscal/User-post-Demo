const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { initializePassport } = require("../config/passport");
const dotenv = require("dotenv").config();
const Posts = require("../models/posts");
const User = require("../models/User");
const Role=require("../models/Roles");
const Comment = require("../models/Comment");
const { upload } = require("../services/multer");
const { userRegistervalidator, loginvalidator } = require("../services/uservalidation");
const passport = require("passport");
const posts = require("../models/posts");
const { authorization } = require("../config/rolesverfier");
const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

initializePassport(passport);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

router.get("/addcomment", authorization(['user,admin']), (req, res) => {
  res.render("show");
});
router.post("/addcomment/:id",
  authorization(['user','admin']),
  async (req, res) => {
    try {
      const id = req.params.id;
      const newcomment = new Comment({
        user: req.user._id,
        post: id,
        comment: req.body.comment,
      });
      await newcomment.save();
      res.status(200).json({commment:newcomment.comment})
      // console.log(saved);
    } catch (error) {
      res.send(error);
    }
  }
);
router.post("/deletegetmypost/:id", authorization(['user','admin']), async (req, res) => {
  try {
    const id = req.params.id;;
    // console.log(id)
    const comment = await Comment.findOne({ _id: id });
    if (!comment) {
      return res.status(404).send("Comment not found");
    }
    const updatecomment = await Comment.updateOne(
      { _id: comment._id },
      {
        $set: {
          isDeleted: 1,
        },
      }
    )
    if (!updatecomment) {
      res.send("error while removing comment");
    }
    res.redirect(`/getmypost/${comment.post}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/deletecomment/:id", authorization(['user','admin']), async (req, res) => {
  try {
    const id = req.params.id;;
    // console.log(id)
    const comment = await Comment.findOne({ _id: id }).populate('user');
    if (!comment) {
      return res.status(404).send("Comment not found");
    }
    const Admin= await Role.findOne({role:'admin'})
    if(!Admin){
        return res.status(404).send("role not found")
    }
    const finduser=await  User.findOne({_id:req.user._id})
    if(!finduser){
        return res.status(404).send("unauthorized")
    }
    if ((req.user._id.equals(comment.user._id))||(finduser.role.includes(Admin._id))) {
      const updatecomment = await Comment.updateOne(
        { _id: comment._id },
        {
          $set: {
            isDeleted: 1,
          },
        }
      )
      if (!updatecomment) {
        res.send("error while removing comment");
      }
      return res.status(200).json({message:"comment deleted sucessfully"})
    }
    
    res.redirect(`/getuserpost/${comment.post}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;