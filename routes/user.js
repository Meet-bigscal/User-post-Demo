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
const { registerValidation, loginValidation } = require("../services/uservalidation");
const { validate } = require('express-validation')
const passport = require("passport");
const posts = require("../models/posts");
const { authorization, isAdmin } = require("../config/rolesverfier");

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

initializePassport(passport);

router.get("/", (req, res) => {
  res.render("registration");
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

router.post("/registration", validate(registerValidation), async (req, res) => {
  try {
    const find = await User.findOne({ email: req.body.email });
    if (find) {
      return res.send("user already registered");
    }

    const role = await Role.findOne({ role: "user" })
    if (!role) {
      return res.send("role not found")
    }
    if(req.body.password=== req.body.confirmpassword){
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      role: role._id,
      password: req.body.password,
    });
    await user.save();
    return res.status(200).json({ data: { name: user.name, username: user.username, email: user.email } })
  }
     else{
      return res.status(400).json({ error: "passwords do not match" })
     }
  } catch (err) {
    res.send(err.message)
  }
})

router.get("/login", (req, res) => {
  return res.render("login.ejs");
});
router.post("/login", validate(loginValidation), async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.send("User not Registered");
    }
    const validpassword = bcrypt.compareSync(req.body.password, user.password)
    if (!validpassword) {
      return res.send("Invalid password");
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,

    }
    const token = jwt.sign(payload, process.env.SECRET_KEY)
    res.cookie('IsLoggin', true)
    res.cookie('token', token)
    res.status(200).json({ data: { name: user.name, username: user.username, email: user.email, token: token } })
  } catch (err) {
    res.send(err.message)
  }
})

router.get("/assign", isAdmin, (req, res) => {
  return res.render("roleassign")
});

router.post("/assign", isAdmin, async (req, res) => {
  try {

    const user = await User.findOne({ email: email }).populate('role')
    if (!user) {
      return res.send("User not found");
    }
    const role = await Role.findOne({ role: req.body.role })
    if (!role) {
      return res.send("role not found");
    }
    await user.role.push(role);
    await user.save()
    res.status(200).json({data:{name:user.name,username:user.username,role:user.role.role}})
  } catch (error) {
    res.send(error.message)
  }
})
router.get("/logout", authorization(['user', 'admin']), logoutUser);
function logoutUser(req, res) {
  res.clearCookie("token");
  res.clearCookie("isLoggedIn");
  res.status(200).json({message:"User Logout"});
}
module.exports = router;