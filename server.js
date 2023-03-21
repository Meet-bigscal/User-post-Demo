const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const ejs = require('ejs');
const path = require('path');
const session=require('express-session')
const cookies=require('cookie-parser')
const {ValidationError}= require("express-validation")
// const index = require('./routes/index');
const user=require('./routes/user');
const post=require('./routes/post')
const comment=require('./routes/comment')
const index=require('./routes/index')

const connectDb=require('./config/connectDb')
const mongoose = require("mongoose")
const app = express()
const port = parseInt(process.env.PORT)
app.use(cookies())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs')
app.use('/getuserpost/',express.static('public'))
app.use('/getuserpost/',express.static('upload'))
app.use('/getuserpost/',express.static('public'))
app.use('/getuserpost/:id',express.static('upload'))
app.use('/getuserpost/:id',express.static('public'))
app.use('/getmypost/:id',express.static('public'))
app.use('/getmypost/:id',express.static('upload'))

app.use(express.static('upload'))

// app.use(express.static('public'))
// app.use(express.static(__dirname + '/views'));
// app.use('/', index);
app.use('/',user)
app.use('/',post)
app.use('/',comment)
app.use('/',index)

app.get('/', (req, res) => res.send('Hello World!'))
app.use(function(err, req, res, next){
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err)
      }
      return res.status(500).json(err)
    })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))