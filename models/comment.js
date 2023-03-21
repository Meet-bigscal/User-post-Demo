const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: 0
        },
        deletedBy: {
            type: String,
        },
        deletedAt: {
            type: Date,
            default: Date.now
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
);
module.exports = mongoose.model("Comment", commentSchema);