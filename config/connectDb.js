const mongoose = require("mongoose");

mongoose.set("strictQuery", "true")
mongoose.connect("mongodb://localhost:27017/forumDb", {
    useNewUrlParser: true,

})
.then(() => {
        console.log("Connected to Database")
 }).catch((err) => {
        console.log("Message Error", err.message)
 })

