import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: String,
    stars: {
        type: Number,
        required: true,
        min:0,
        max:5
    },
    date: {
        type: Date,
        required: true
    }
});

const Comment = mongoose.model('Comment', commentSchema)

//The compiled schema is made available to other modules
export {Comment, commentSchema}
