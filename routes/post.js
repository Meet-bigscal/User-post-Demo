const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { initializePassport } = require("../config/passport");
const dotenv = require("dotenv").config();
const Posts = require("../models/posts");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Role = require('../models/Roles')
const { upload } = require("../services/multer");
const { postvalidator } = require("../services/postsvalidation")
const { validate } = require('express-validation')
const passport = require("passport");
const posts = require("../models/posts");
const { required } = require("joi");
const { authorization, isAdmin } = require("../config/rolesverfier");
const { name } = require("ejs");
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

router.get("/home", authorization(['user', 'admin']), (req, res) => {
  res.redirect("/post")
});

router.get("/post/new", authorization(['user', 'admin']), (req, res) => {
  res.render("post");
});


router.get("/getpost", authorization(['user', 'admin']), async (req, res) => {
  try {
    const getAllposts = await Posts.find({ isDeleted: false }, '-__v -isDeleted -createdAt -updatedAt -deletedAt -deletedBy -user');
    if (!getAllposts) {
      return res.send("no post found")
    }
    res.status(200).json(getAllposts)

  } catch (err) {
    res.send(err.message);
  }
});

router.post("/post", authorization(['user', 'admin']), upload.single("image"), validate(postvalidator),
  async (req, res) => {
    try {
      const post = new Posts({
        title: req.body.title,
        description: req.body.description,
        image: req.file.filename,
        user: req.user._id,
      });
      await post.save();
      res.status(200).json({ post: { title: post.title, image: post.image, description: post.description } })
    } catch (err) {
      res.send(err.message);
    }
  }
);
router.get("/mypost", authorization(['user', 'admin']), async (req, res) => {
  try {
    const id = req.user._id
    const post = await Posts.find({ user: id, isDeleted: false }, '-__v -isDeleted -createdAt -updatedAt -deletedAt -deletedBy -user')
    if (!post) {
      return res.send("Post not found")
    }
    res.status(200).json(post)
  } catch (error) {
    res.send(error.message)
  }
})

router.get("/getmypost/:id", authorization(['user', 'admin']), async (req, res) => {
  try {
    const id = req.params.id
    const post = await Posts.findOne({ _id: id }).populate('user')
    if (!post) {
      return res.send("Post not found")
    }
    const comment = await Comment.findOne({ post: id, isDeleted: false }).populate("post").populate("user")

    const comments = {
      Name: comment.user.name,
      Comment: comment.comment,
      Date: comment.createdAt
    }
    res.status(200).json({ title: p.title, image: p.image, description: p.description, name: p.user.name, comment: comments })
  }

  catch (error) {
    res.send(error.message)
  }
})

router.get("/getuserpost/:id", authorization(['user', 'admin']), async (req, res) => {
  const id = req.params.id;
  const p = await Posts.findOne({ _id: id }).populate("user")
  if (!p) {
    return res.send("post not found")
  }
  const comment = await Comment.find({ post: id, isDeleted: false }).populate("post").populate({ path: "user", select: "name" })

  if (!comment) {
    return res.send("comment not found")
  }
const commnets={}

comment.forEach((comments)=>{
  commnets["Name"]=comments.user.name,
  commnets["Comment"]=comments.comment,
  commnets["Date"]=comments.createdAt
})

res.status(200).json({data:{title:p.title,image:p.image,description:p.description,name:p.user.name,comments:commnets}})


  
  // console.log(p)
});
router.get('/edit/:id', authorization(['user', 'admin']), async (req, res) => {
  try {
    const id = req.params.id
    const post = await Posts.find({ _id: id })
    if (!post) {
      res.send("post  not  found")
    }
    res.render("edit", {
      posts: post
    })
  } catch (error) {
    res.send(error.message)
  }
})
router.post('/edit/:id', authorization(['user', 'admin']), upload.single('image'), validate(postvalidator), async (req, res) => {
  try {
    const id = req.params.id
    const post = await Posts.findOne({ _id: id })
    if (!post) {
      return res.send("post not found")
    }
    const Admin = await Role.findOne({ role: 'admin' })
    if (!Admin) {
      return res.status(404).send("role not found")
    }
    const finduser = await User.findOne({ _id: req.user._id })
    if (!finduser) {
      return res.status(404).send("unauthorized")
    }

    if ((req.user._id.equals(post.user._id)) || (finduser.role.includes(Admin._id))) {

      let file = req.file
      if (!file) {
        const updatepost = await Posts.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatepost) {
          return res.send("Error while updating data")
        }
      }
      else {
        const updatepost = await Posts.updateOne({ _id: id }, {
          $set: {
            title: req.body.title,
            image: file.filename,
            description: req.body.description
          }
        })
        if (!updatepost) {
          return res.send("Error while updating data")

        }
      }
      return res.status(200).json({ "message": "Post Update sucessfully" })
    }
    else {
      return res.status(404).send("unauthorized")
    }

  } catch (err) {
    res.send(err.message)
  }
})
router.get('/show/edit/:id', isAdmin, async (req, res) => {
  try {
    const id = req.params.id
    const post = await Posts.find({ _id: id })
    if (!post) {
      res.send("post  not  found")
    }
    res.render("adminedit", {
      posts: post
    })
  } catch (error) {
    res.send(error.message)
  }
})

router.post('/show/edit/:id', isAdmin, upload.single('image'), validate(postvalidator), async (req, res) => {
  try {
    const id = req.params.id
    const post = await Posts.findOne({ _id: id })
    if (!post) {
      return res.send("post not found")
    }
    let file = req.file
    if (!file) {
      const updatepost = await Posts.findByIdAndUpdate(id, req.body, { new: true })
      if (!updatepost) {
        res.send("Error while updating data")
      }
    }
    else {
      const updatedata = await Posts.updateOne({ _id: id }, {
        $set: {
          title: req.body.title,
          image: file.filename,
          description: req.body.description
        }
      })
      if (!updatedata) {
        res.send("Error while updating data")
      }
    }
    res.redirect('/post')
  } catch (err) {
    res.send(err.message)
  }
})

router.post('/deletepost/:id', authorization(['user', 'admin']), async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findOne({ _id: id });
    if (!post) {
      return res.status(404).send("Comment not found");
    }
    const Admin = await Role.findOne({ role: 'admin' })
    if (!Admin) {
      return res.status(404).send("role not found")
    }
    const finduser = await User.findOne({ _id: req.user._id })
    if (!finduser) {
      return res.status(404).send("unauthorized")
    }

    if ((req.user._id.equals(post.user._id)) || (finduser.role.includes(Admin._id))) {
      const updatepost = await Posts.updateOne(
        { _id: id },
        {
          $set: {
            isDeleted: 1,
          },
        }
      );
      if (!updatepost) {
        res.send("error while removing post");
      }
      return res.status(200).json({ message: "post remove sucessfully" })
    }
    else {
      return res.status(404).send("unauthorized")
    }

  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/show/deletepost/:id', isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id)
    const post = await Posts.findOne({ _id: id });
    if (!post) {
      return res.status(404).send("Comment not found");
    }
    const updatepost = await Posts.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: 1,
        },
      }
    );
    if (!updatepost) {
      res.send("error while removing post");
    }
    res.redirect('/post');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;